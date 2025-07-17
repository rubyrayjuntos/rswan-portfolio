# PowerShell script to rename long DALL-E filenames (Version 2)
# This script handles special characters and edge cases

Write-Host "Starting batch rename of long filenames (Version 2)..." -ForegroundColor Green

# Function to safely rename files with better error handling
function Rename-LongFiles {
    param(
        [string]$Directory,
        [string]$ProjectName
    )
    
    Write-Host "Processing $ProjectName..." -ForegroundColor Yellow
    
    $files = Get-ChildItem -Path $Directory -File | Where-Object { $_.Name.Length -gt 100 }
    
    if ($files.Count -eq 0) {
        Write-Host "No long filenames found in $ProjectName" -ForegroundColor Gray
        return
    }
    
    $counter = 1
    foreach ($file in $files) {
        $extension = $file.Extension
        $newName = "$ProjectName-$counter$extension"
        $newPath = Join-Path $Directory $newName
        
        # Check if target file already exists
        while (Test-Path $newPath) {
            $counter++
            $newName = "$ProjectName-$counter$extension"
            $newPath = Join-Path $Directory $newName
        }
        
        try {
            # Use Move-Item instead of Rename-Item for better handling of special characters
            Move-Item -Path $file.FullName -Destination $newPath -Force
            Write-Host "Renamed: $($file.Name) -> $newName" -ForegroundColor Green
            $counter++
        }
        catch {
            Write-Host "Error renaming $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Trying alternative method..." -ForegroundColor Yellow
            
            try {
                # Alternative method using .NET
                $oldPath = $file.FullName
                [System.IO.File]::Move($oldPath, $newPath)
                Write-Host "Renamed (alternative method): $($file.Name) -> $newName" -ForegroundColor Green
                $counter++
            }
            catch {
                Write-Host "Failed to rename $($file.Name) - skipping..." -ForegroundColor Red
            }
        }
    }
}

# Process each project directory
$projectDirs = @(
    @{ Path = "images/projects/character-design"; Name = "character-design" },
    @{ Path = "images/projects/nova-writers-conspiracy"; Name = "nova-writers" },
    @{ Path = "images/projects/asteroids"; Name = "asteroids" },
    @{ Path = "images/projects/sticker-pack"; Name = "sticker-pack" },
    @{ Path = "images/projects/world-bible"; Name = "world-bible" },
    @{ Path = "images/projects/set-design"; Name = "set-design" },
    @{ Path = "images/projects/elyra"; Name = "elyra" },
    @{ Path = "images/projects/weight-of-a-name"; Name = "weight-name" },
    @{ Path = "images/projects/tarot-awakened"; Name = "tarot-awakened" },
    @{ Path = "images/projects/brand-automation"; Name = "brand-automation" },
    @{ Path = "images/projects/tarot-deck"; Name = "tarot-deck" },
    @{ Path = "images/projects/arcana"; Name = "arcana" },
    @{ Path = "images/projects/henri-ruben"; Name = "henri-ruben" },
    @{ Path = "images/projects/graphic-novel"; Name = "graphic-novel" }
)

foreach ($project in $projectDirs) {
    if (Test-Path $project.Path) {
        Rename-LongFiles -Directory $project.Path -ProjectName $project.Name
    } else {
        Write-Host "Directory not found: $($project.Path)" -ForegroundColor Yellow
    }
}

Write-Host "`nBatch rename completed!" -ForegroundColor Green
Write-Host "You can now commit your changes without filename length issues." -ForegroundColor Cyan 