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

    function setupVinylSlot(slot) {
        slot.addEventListener('click', () => {
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

        slot.addEventListener('mousedown', (e) => {
            if (!stack.classList.contains('scattered-view')) return;
            if (e.button !== 0) return; // Only left click
            
            e.preventDefault(); // Prevent native image dragging

            isDragging = true;
            hasMoved = false;
            dragStartTime = Date.now();
            
            slot.style.transition = 'none';
            slot.style.zIndex = '1000';
            
            const onMouseMove = (moveEvent) => {
                if (!isDragging) return;
                hasMoved = true;
                
                // Calculate position relative to center of screen (matching CSS top:50% left:50%)
                const newX = (moveEvent.clientX - window.innerWidth / 2) + 'px';
                const newY = (moveEvent.clientY - window.innerHeight / 2) + 'px';
                
                slot.style.setProperty('--random-x', newX);
                slot.style.setProperty('--random-y', newY);
            };

            const onMouseUp = () => {
                isDragging = false;
                slot.style.transition = '';
                slot.style.zIndex = '';
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                
                // If the user moved the record significantly, prevent the click event from triggering play
                if (hasMoved) {
                    slot.style.pointerEvents = 'none';
                    setTimeout(() => slot.style.pointerEvents = '', 50);
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });

    // --- Scroll Rotation Logic for CD Orbit View ---
    let currentOrbitAngle = 0;
    stack.addEventListener('wheel', (e) => {
        if (!stack.classList.contains('cd-orbit-view')) return;
        
        e.preventDefault(); // Prevent page scrolling
        
        // Adjust angle based on scroll wheel delta
        currentOrbitAngle += (e.deltaY + e.deltaX) * -0.2; 
        
        // Update a CSS variable on the stack that all slots can use
        stack.style.setProperty('--global-orbit-angle', currentOrbitAngle + 'deg');
    }, { passive: false });

    // View Switcher Logic
    const viewSwitcher = document.querySelector('.dropdown-select');
    
    if (viewSwitcher && stack) {
        viewSwitcher.addEventListener('change', (e) => {
            const view = e.target.value;
            // Clear all view classes
            stack.classList.remove('grid-view', 'list-view', 'scattered-view', 'cd-orbit-view', 'isometric-view');
            
            if (view !== 'horizontal') {
                stack.classList.add(view + '-view');
            }
        });
    }
});
