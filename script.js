document.addEventListener('DOMContentLoaded', () => {
    const audioBtn = document.querySelector('.audio-btn');
    let isMuted = false;
    
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            if(isMuted) {
                audioBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                </svg>`;
            } else {
                audioBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>`;
            }
        });
    }

    function playTrack(slot) {
        // Remove playing state from others
        document.querySelectorAll('.vinyl-slot').forEach(s => s.classList.remove('playing'));
        // Add playing state to clicked vinyl
        slot.classList.add('playing');
        
        // Inject mini widget at the bottom
        const container = document.getElementById('widget-container');
        if (container && slot.dataset.widget) {
            let widgetHTML = slot.dataset.widget;
            if(widgetHTML.indexOf('autoplay=true') === -1) {
                widgetHTML = widgetHTML.replace('transparent=true/', 'transparent=true/autoplay=true/');
            }
            container.innerHTML = widgetHTML;
            container.style.display = 'block';
        }
    }

    function setupVinylSlot(slot) {
        slot.addEventListener('click', () => {
            playTrack(slot);
        });
        
        slot.addEventListener('mouseleave', () => {
            slot.classList.remove('active');
        });
    }

    // Listen for click on vinyl artworks
    document.querySelectorAll('.vinyl-slot').forEach(slot => {
        setupVinylSlot(slot);
    });

    // Modal logic for the sticky note
    const titleBtn = document.getElementById('title-btn');
    const noteModal = document.getElementById('note-modal');
    const closeModal = document.getElementById('close-modal');

    if (titleBtn && noteModal && closeModal) {
        titleBtn.addEventListener('click', () => {
            noteModal.classList.add('active');
        });
        
        closeModal.addEventListener('click', () => {
            noteModal.classList.remove('active');
        });
        
        // Close modal when clicking outside the sticky note
        noteModal.addEventListener('click', (e) => {
            if (e.target === noteModal) {
                noteModal.classList.remove('active');
            }
        });
    }

    const randomBtn = document.querySelector('.random-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const slots = document.querySelectorAll('.vinyl-slot');
            if (slots.length > 0) {
                // Remove active class from all
                slots.forEach(s => s.classList.remove('active'));
                
                // Pick random
                const randomIndex = Math.floor(Math.random() * slots.length);
                const randomSlot = slots[randomIndex];
                
                randomSlot.classList.add('active');
                randomSlot.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
            }
        });
    }

    // Setup CSS custom properties for scattered and orbit views
    const stack = document.getElementById('stack');
    const slots = document.querySelectorAll('.vinyl-slot');
    const totalItems = slots.length;

    slots.forEach((slot, index) => {
        // Scattered view: random positions in a virtual space
        const randomX = (Math.random() - 0.5) * 80 + 'vw';
        const randomY = (Math.random() - 0.5) * 80 + 'vh';
        const randomRotZ = (Math.random() - 0.5) * 360 + 'deg';
        
        slot.style.setProperty('--random-x', randomX);
        slot.style.setProperty('--random-y', randomY);
        slot.style.setProperty('--random-rot-z', randomRotZ);
        
        // CD Orbit view: properties for circular math
        slot.style.setProperty('--index', index);
        slot.style.setProperty('--total-items', totalItems);

        // --- Dragging Logic for Scattered View ---
        let isDragging = false;
        let dragStartTime;
        let hasMoved = false;

        const startDrag = (e) => {
            if (!stack.classList.contains('scattered-view')) return;
            if (e.type === 'mousedown' && e.button !== 0) return; // Only left click

            isDragging = true;
            hasMoved = false;
            
            const startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

            if (e.type === 'mousedown') e.preventDefault(); // Prevent native image dragging

            slot.style.transition = 'none';
            slot.style.zIndex = '1000';
            
            const onMove = (moveEvent) => {
                if (!isDragging) return;
                hasMoved = true;
                
                const currentX = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientX : moveEvent.clientX;
                const currentY = moveEvent.type.includes('touch') ? moveEvent.touches[0].clientY : moveEvent.clientY;

                // Calculate position relative to center of screen
                const newX = (currentX - window.innerWidth / 2) + 'px';
                const newY = (currentY - window.innerHeight / 2) + 'px';
                
                slot.style.setProperty('--random-x', newX);
                slot.style.setProperty('--random-y', newY);
            };

            const endDrag = () => {
                isDragging = false;
                slot.style.transition = '';
                slot.style.zIndex = '';
                
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', endDrag);
                
                if (hasMoved) {
                    slot.style.pointerEvents = 'none';
                    setTimeout(() => slot.style.pointerEvents = '', 50);
                }
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', endDrag);
        };

        slot.addEventListener('mousedown', startDrag);
        slot.addEventListener('touchstart', startDrag, { passive: false });
    });

    // --- Scroll/Touch Rotation Logic for CD Orbit View ---
    let currentOrbitAngle = 0;
    let lastTouchX = 0;

    const handleOrbitScroll = (delta) => {
        currentOrbitAngle += delta * -0.2;
        stack.style.setProperty('--global-orbit-angle', currentOrbitAngle + 'deg');
    };

    stack.addEventListener('wheel', (e) => {
        if (!stack.classList.contains('cd-orbit-view')) return;
        e.preventDefault();
        handleOrbitScroll(e.deltaY + e.deltaX);
    }, { passive: false });

    stack.addEventListener('touchstart', (e) => {
        if (!stack.classList.contains('cd-orbit-view')) return;
        lastTouchX = e.touches[0].clientX;
    }, { passive: true });

    stack.addEventListener('touchmove', (e) => {
        if (!stack.classList.contains('cd-orbit-view')) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - lastTouchX;
        lastTouchX = currentX;
        handleOrbitScroll(-deltaX * 5); // Multiplier for touch sensitivity
    }, { passive: true });

    // --- iPod View Logic ---
    const ipodTrackList = document.querySelector('.ipod-track-list');
    const ipodPlayer = document.querySelector('.ipod-player');

    function updateIpodList() {
        if (!ipodTrackList) return;
        ipodTrackList.innerHTML = '';
        slots.forEach((slot, index) => {
            const trackName = slot.querySelector('.list-view-title')?.textContent || `Track ${index + 1}`;
            const li = document.createElement('li');
            li.textContent = trackName;
            li.dataset.index = index;
            if (slot.classList.contains('playing')) li.classList.add('selected');
            
            li.addEventListener('click', () => {
                selectIpodTrack(index);
            });
            ipodTrackList.appendChild(li);
        });
    }

    function selectIpodTrack(index) {
        document.querySelectorAll('.ipod-track-list li').forEach(li => li.classList.remove('selected'));
        const selectedLi = ipodTrackList.querySelector(`li[data-index="${index}"]`);
        if (selectedLi) selectedLi.classList.add('selected');
        
        playTrack(slots[index]); // Use new direct function instead of .click()
        showIpodPlayer(index);
    }

    function showIpodPlayer(index) {
        const slot = slots[index];
        const art = slot.querySelector('img').src;
        const title = slot.querySelector('.list-view-title')?.textContent || "Unknown Track";
        
        const miniArt = document.querySelector('.ipod-mini-art');
        const trackTitle = document.querySelector('.ipod-track-title');
        
        if (miniArt) miniArt.style.backgroundImage = `url(${art})`;
        if (trackTitle) trackTitle.textContent = title;
        
        if (ipodTrackList) ipodTrackList.style.display = 'none';
        if (ipodPlayer) ipodPlayer.style.display = 'flex';
    }

    // iPod Buttons
    document.querySelector('.menu-btn')?.addEventListener('click', () => {
        if (ipodTrackList) ipodTrackList.style.display = 'block';
        if (ipodPlayer) ipodPlayer.style.display = 'none';
    });

    document.querySelector('.wheel-center')?.addEventListener('click', () => {
        let selected = ipodTrackList?.querySelector('li.selected');
        if (!selected && ipodTrackList) {
            selected = ipodTrackList.querySelector('li');
        }
        if (selected && (ipodTrackList.style.display !== 'none' || !document.querySelector('.vinyl-slot.playing'))) {
            selectIpodTrack(selected.dataset.index);
        }
    });

    document.querySelector('.prev-btn')?.addEventListener('click', () => {
        const currentIndex = Array.from(slots).findIndex(s => s.classList.contains('playing'));
        const prevIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + slots.length) % slots.length;
        selectIpodTrack(prevIndex);
    });

    document.querySelector('.next-btn')?.addEventListener('click', () => {
        const currentIndex = Array.from(slots).findIndex(s => s.classList.contains('playing'));
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % slots.length;
        selectIpodTrack(nextIndex);
    });

    document.querySelector('.play-btn')?.addEventListener('click', () => {
        let selected = ipodTrackList?.querySelector('li.selected');
        if (!selected && ipodTrackList) {
            selected = ipodTrackList.querySelector('li');
        }
        if (selected) selectIpodTrack(selected.dataset.index);
    });

    // Click Wheel Scroll Simulation
    document.querySelector('.ipod-click-wheel')?.addEventListener('wheel', (e) => {
        if (!stack.classList.contains('ipod-view')) return;
        if (!ipodTrackList || ipodTrackList.style.display === 'none') return;
        
        e.preventDefault();
        const items = ipodTrackList.querySelectorAll('li');
        if (items.length === 0) return;

        let selectedIndex = Array.from(items).findIndex(li => li.classList.contains('selected'));
        if (selectedIndex === -1) selectedIndex = 0;
        
        if (e.deltaY > 0) {
            selectedIndex = (selectedIndex + 1) % items.length;
        } else {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        }

        items.forEach(li => li.classList.remove('selected'));
        items[selectedIndex].classList.add('selected');
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
    }, { passive: false });

    // View Switcher Logic
    const viewSwitcher = document.querySelector('.dropdown-select');
    
    if (viewSwitcher && stack) {
        viewSwitcher.addEventListener('change', (e) => {
            const view = e.target.value;
            // Clear all view classes
            stack.classList.remove('grid-view', 'list-view', 'scattered-view', 'cd-orbit-view', 'isometric-view', 'ipod-view');
            
            if (view !== 'horizontal') {
                stack.classList.add(view + '-view');
            }

            if (view === 'ipod') {
                updateIpodList();
                const playingIndex = Array.from(slots).findIndex(s => s.classList.contains('playing'));
                if (playingIndex !== -1) {
                    showIpodPlayer(playingIndex);
                } else {
                    if (ipodTrackList) ipodTrackList.style.display = 'block';
                    if (ipodPlayer) ipodPlayer.style.display = 'none';
                }
            }
        });
    }
});
