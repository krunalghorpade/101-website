<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Music Showcase</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <nav class="top-nav">
        <div class="site-info" id="title-btn">
            <h1>101 Epic Days of House - by Kratex</h1>
        </div>
    </nav>

    <div id="note-modal" class="modal-overlay">
        <div class="sticky-note">
            <button id="close-modal" class="close-btn">&times;</button>
            <p>101 Epic Days of House Is a Series where i make a house track everyday, straight for 101 days. This is my journey to push myself to the maximum because i wont stop</p>
            <p>I am persistent towards making Kratex the number one dj in the world and yes it will happen</p>
            <p class="signature">- Kratex</p>
        </div>
    </div>

    <div class="bottom-nav">
        <div class="bottom-left">
            <select class="filter-pill dropdown-select">
                <option value="horizontal">Horizontal Air Shelf</option>
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
                <option value="scattered">Scattered Room View</option>
                <option value="cd-orbit">CD Orbit</option>
                <option value="ipod">iPod View</option>
            </select>
        </div>

    </div>

    <div class="vinyl-stack" id="stack">
        <?php
        $cacheFile = 'tracks_cache.json';
        $cacheTime = 3600; // 1 hour cache

        if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheTime) {
            $bandcampData = json_decode(file_get_contents($cacheFile), true);
        } else {
            $url = "https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time";
            $options = [
                "http" => [
                    "header" => "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)\r\n"
                ]
            ];
            $context = stream_context_create($options);
            $html = @file_get_contents($url, false, $context);
            $bandcampData = null;
            if ($html && preg_match('/data-tralbum="([^"]+)"/', $html, $matches)) {
                $dataStr = html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8');
                $bandcampData = json_decode($dataStr, true);
                file_put_contents($cacheFile, json_encode($bandcampData));
            } elseif (file_exists($cacheFile)) {
                $bandcampData = json_decode(file_get_contents($cacheFile), true);
            }
        }

        if ($bandcampData && isset($bandcampData['trackinfo'])) {
            $albumId = $bandcampData['id'];
            $albumArtUrl = "https://f4.bcbits.com/img/a" . $bandcampData['art_id'] . "_10.jpg";
            
            $trackArtsFile = 'track_arts.json';
            $trackArts = file_exists($trackArtsFile) ? json_decode(file_get_contents($trackArtsFile), true) : [];
            $trackArtsUpdated = false;
            
            foreach ($bandcampData['trackinfo'] as $index => $t) {
                $trackNum = $t['track_num'];
                $trackTitle = $t['title'];
                $trackId = $t['track_id'];
                
                // Construct widget
                $widget = '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=' . $albumId . '/size=small/bgcol=ffffff/linkcol=0687f5/track=' . $trackId . '/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>';
                
                // Fetch individual track artwork if not in cache
                if (!isset($trackArts[$trackId])) {
                    $trackUrl = "https://kratex.bandcamp.com" . $t['title_link'];
                    $trackHtml = @file_get_contents($trackUrl, false, $context);
                    if ($trackHtml && preg_match('/data-tralbum="([^"]+)"/', $trackHtml, $trackMatches)) {
                        $trackDataStr = html_entity_decode($trackMatches[1], ENT_QUOTES, 'UTF-8');
                        $trackData = json_decode($trackDataStr, true);
                        if (isset($trackData['art_id'])) {
                            $trackArts[$trackId] = "https://f4.bcbits.com/img/a" . $trackData['art_id'] . "_10.jpg";
                        } else {
                            $trackArts[$trackId] = $albumArtUrl;
                        }
                        $trackArtsUpdated = true;
                    } else {
                        $trackArts[$trackId] = $albumArtUrl;
                    }
                }
                
                $art = isset($trackArts[$trackId]) ? $trackArts[$trackId] : $albumArtUrl;
                
                // Find custom local artwork if exists (e.g. 001 - my gang.png)
                $paddedNum = sprintf('%03d', $trackNum);
                $localArts = glob("images/artworks/{$paddedNum}*.{jpg,jpeg,png,gif}", GLOB_BRACE);
                if (!empty($localArts)) {
                    $art = $localArts[0];
                }
                
                echo '<div class="vinyl-slot" data-widget="'.htmlspecialchars($widget).'">';
                echo '  <div class="vinyl-cover">';
                echo '    <div class="spine"></div>';
                
                // The Vinyl Record inside the sleeve
                echo '    <div class="vinyl-record-container">';
                echo '      <div class="vinyl-record">';
                echo '         <div class="record-label" style="background-image: url(\''.htmlspecialchars($art).'\');"></div>';
                echo '      </div>';
                echo '    </div>';

                echo '    <img src="'.htmlspecialchars($art).'" alt="Artwork" draggable="false" style="position: relative; z-index: 2; width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">';
                echo '  </div>';
                
                // Title for list view
                echo '  <div class="list-view-title">' . htmlspecialchars($trackTitle) . '</div>';
                
                echo '</div>';
            }
            
            if ($trackArtsUpdated) {
                file_put_contents($trackArtsFile, json_encode($trackArts));
            }
        } else {
            echo "<p>Could not load tracks.</p>";
        }
        ?>
    </div>

    <!-- iPod View Container -->
    <div id="ipod-wrapper" class="ipod-wrapper">
        <div class="ipod-device">
            <div class="ipod-screen-container">
                <div class="ipod-screen">
                    <div class="ipod-status-bar">
                        <span>iPod</span>
                        <span class="battery">🔋</span>
                    </div>
                    <div class="ipod-content">
                        <ul class="ipod-track-list">
                            <!-- Populated via JS -->
                        </ul>
                        <div class="ipod-player" style="display:none;">
                            <div class="ipod-mini-art"></div>
                            <div class="ipod-info-block">
                                <div class="ipod-track-title">Now Playing</div>
                                <div class="ipod-artist-name">Kratex</div>
                                <div class="ipod-progress-container">
                                    <div class="ipod-progress-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ipod-wheel-area">
                <div class="ipod-click-wheel">
                    <button class="wheel-btn menu-btn">MENU</button>
                    <button class="wheel-btn prev-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 18V6h2v12H6zm3.5-6L18 18V6l-8.5 6z"/></svg>
                    </button>
                    <button class="wheel-btn next-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>
                    <button class="wheel-btn play-btn">
                        <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                    </button>
                    <div class="wheel-center"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="widget-container" style="display: none;">
        <!-- Mini widget injected here -->
    </div>

    <script src="script.js"></script>
</body>
</html>
