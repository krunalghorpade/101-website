const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// we want to refactor the event listener adding into a function
// and implement infinite scroll

code = code.replace(
    /document\.querySelectorAll\('\.vinyl-slot'\)\.forEach\(slot => \{[\s\S]*?\}\);/g, 
    `function setupVinylSlot(slot) {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.vinyl-slot').forEach(s => s.classList.remove('playing'));
            slot.classList.add('playing');
            
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

    document.querySelectorAll('.vinyl-slot').forEach(slot => {
        setupVinylSlot(slot);
    });

    const stack = document.getElementById('stack');
    if (stack) {
        stack.addEventListener('scroll', () => {
            const maxScrollLeft = stack.scrollWidth - stack.clientWidth;
            if (stack.scrollLeft >= maxScrollLeft - 1000) {
                const slots = Array.from(stack.querySelectorAll('.vinyl-slot'));
                // clone 20 items from the beginning of the list
                for(let i = 0; i < 20; i++) {
                    // to keep variety, clone from a random or sequential part? 
                    // let's just clone the first 20 items of the current nodes, 
                    // or better, find the original 40 items pattern.
                    // Wait, there are 40 items initially.
                    const originalIndex = i % 40;
                    const clone = slots[originalIndex].cloneNode(true);
                    setupVinylSlot(clone);
                    stack.appendChild(clone);
                }
            }
            
            if (stack.scrollLeft <= 1000 && stack.children.length > 0) {
                // clone items and prepend
                const slots = Array.from(stack.querySelectorAll('.vinyl-slot'));
                let addedWidth = 0;
                for(let i = 0; i < 20; i++) {
                    const originalIndex = (40 - 1) - (i % 40);
                    const clone = slots[originalIndex].cloneNode(true);
                    setupVinylSlot(clone);
                    stack.insertBefore(clone, stack.firstChild);
                    // the width is usually 12px, but we can measure it
                    // addedWidth += clone.offsetWidth; // normally 12px unless expanded
                    // Actually, if we just add to the left, the scroll position shifts by the added width.
                    // But prepending in flex can cause scroll jumps.
                }
                // stack.scrollLeft += addedWidth;
            }
        });
    }`
);

fs.writeFileSync('script.js.new', code);
