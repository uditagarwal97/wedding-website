param (
    [int]$Port = 8080,
    [string]$Root = $PSScriptRoot
)

if (-not $Root) {
    $Root = (Get-Location).Path
}

# Find an available port starting from $Port
function Get-AvailablePort([int]$startPort) {
    $port = $startPort
    while ($port -lt ($startPort + 50)) {
        try {
            $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $port)
            $listener.Start()
            $listener.Stop()
            return $port
        } catch {
            $port++
        }
    }
    return $startPort
}

$Port = Get-AvailablePort $Port

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".webp" = "image/webp"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".eot"  = "application/vnd.ms-fontobject"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "Failed to start listener on $prefix : $_"
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "  Royal Wedding Website Server (Udit & Gunjan)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host " Server running at: " -NoNewline
Write-Host "http://localhost:$Port" -ForegroundColor Green
Write-Host " Serving files from: $Root" -ForegroundColor Gray
Write-Host " Press Ctrl+C in this console to stop the server." -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Magenta

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        # Normalize relative path and map to root
        $relPath = $urlPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
        $localPath = [System.IO.Path]::Combine($Root, $relPath)
        $canonicalPath = [System.IO.Path]::GetFullPath($localPath)
        $canonicalRoot = [System.IO.Path]::GetFullPath($Root)

        if (-not $canonicalPath.StartsWith($canonicalRoot, [System.StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path -LiteralPath $canonicalPath -PathType Leaf)) {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.OutputStream.Close()
            continue
        }
        $localPath = $canonicalPath

        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        $response.ContentType = $contentType
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Accept-Ranges", "bytes")
        # Anti-Proxy & Anti-Snooping Headers (Prevents intermediate Wi-Fi/carrier proxies from caching/transcoding photos)
        $response.AddHeader("Cache-Control", "private, no-transform")
        $response.AddHeader("Surrogate-Control", "no-store")
        $response.AddHeader("X-Content-Type-Options", "nosniff")

        $fileInfo = New-Object System.IO.FileInfo($localPath)
        $fileSize = $fileInfo.Length

        # Handle Byte-Range requests for MP4 video / media seeking
        $rangeHeader = $request.Headers["Range"]
        if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
            $rangeVal = $rangeHeader.Substring(6).Trim()
            $rangeParts = $rangeVal.Split("-")
            $start = [int64]0
            $end = $fileSize - 1

            if ($rangeParts[0] -ne "") {
                $start = [int64]$rangeParts[0]
            }
            if ($rangeParts.Length -gt 1 -and $rangeParts[1] -ne "") {
                $end = [int64]$rangeParts[1]
            }

            if ($start -ge $fileSize -or $end -ge $fileSize -or $start -gt $end) {
                $response.StatusCode = 416 # Range Not Satisfiable
                $response.AddHeader("Content-Range", "bytes */$fileSize")
                $response.OutputStream.Close()
                continue
            }

            $lengthToRead = ($end - $start) + 1
            $response.StatusCode = 206 # Partial Content
            $response.AddHeader("Content-Range", "bytes $start-$end/$fileSize")
            $response.ContentLength64 = $lengthToRead

            if ($request.HttpMethod -ne "HEAD") {
                $fs = [System.IO.File]::OpenRead($localPath)
                try {
                    [void]$fs.Seek($start, [System.IO.SeekOrigin]::Begin)
                    $buffer = New-Object byte[] 65536
                    $bytesRemaining = $lengthToRead
                    while ($bytesRemaining -gt 0) {
                        $bytesToRead = [Math]::Min([int64]$buffer.Length, $bytesRemaining)
                        $read = $fs.Read($buffer, 0, $bytesToRead)
                        if ($read -le 0) { break }
                        $response.OutputStream.Write($buffer, 0, $read)
                        $bytesRemaining -= $read
                    }
                } finally {
                    $fs.Close()
                }
            }
        } else {
            $response.StatusCode = 200
            $response.ContentLength64 = $fileSize

            if ($request.HttpMethod -ne "HEAD") {
                $fs = [System.IO.File]::OpenRead($localPath)
                try {
                    $buffer = New-Object byte[] 65536
                    while ($true) {
                        $read = $fs.Read($buffer, 0, $buffer.Length)
                        if ($read -le 0) { break }
                        $response.OutputStream.Write($buffer, 0, $read)
                    }
                } finally {
                    $fs.Close()
                }
            }
        }

        $response.OutputStream.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
