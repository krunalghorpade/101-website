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
            </select>
        </div>

    </div>

    <div id="widget-container" style="display: none;">
        <!-- Mini widget injected here -->
    </div>

    <div class="vinyl-stack" id="stack">
        <?php
        $widgetsMap = [
            1 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=1626526712/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            2 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=280295140/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            3 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=363670738/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            4 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=2926132175/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            5 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=371438780/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            6 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=4093062497/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            7 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=4237285479/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>',
            8 => '<iframe style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=1759628833/size=small/bgcol=ffffff/linkcol=0687f5/track=3735655464/transparent=true/" seamless><a href="https://kratex.bandcamp.com/album/101-epic-days-of-house-music-free-for-limited-time">101 Epic Days of House Music [FREE for Limited Time] by Kratex</a></iframe>'
        ];

        // Dynamically load all images from the folder
        $artworks = glob('images/artworks/*.{jpg,jpeg,png,gif}', GLOB_BRACE);
        
        // Fallback just in case folder is empty
        if(empty($artworks)) {
            $artworks = ['images/album_cover_1.png'];
        }

        // Generate exactly the items available without repeating
        foreach ($artworks as $art) {
            
            // Extract track number from filename (e.g. '008 - in my head.png' -> 8)
            $filename = basename($art);
            preg_match('/^(\d+)/', $filename, $matches);
            $trackNum = isset($matches[1]) ? (int)$matches[1] : 1;
            
            // Fetch correct widget or fallback to track 1
            $widget = isset($widgetsMap[$trackNum]) ? $widgetsMap[$trackNum] : $widgetsMap[1];

            // Extract track name properly for List View
            $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
            $cleanName = preg_replace('/^[\d\s\-]+/', '', $nameWithoutExt);
            $trackTitle = ucwords(str_replace(['-', '_'], ' ', $cleanName));
            if (empty($trackTitle)) $trackTitle = "Track " . $trackNum;

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
        ?>
    </div>

    <script src="script.js"></script>
</body>
</html>
