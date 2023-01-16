let scripts = {
    exchange: [
        [sorts.bubble,256], //Bubble
        [sorts.optimized_bubble,256], //Optimized Bubble
        [sorts.cocktail,256], //Cocktail
        [sorts.optimized_cocktail,256], //Optimized Cocktail
        [sorts.gnome,128], //Gnome
        [sorts.oddeven,256], //Odd-even
        [sorts.comb,1024], //Comb
        [sorts.quick,1024], //Quick
        [sorts.stable_quick,1024], //Quick
    ],
    selection: [
        [sorts.selection,256], //Selection
        [sorts.cycle,128], //Cycle
        [sorts.pigeonhole_cycle,512], //Pigeonhole Cycle
        [sorts.maxheap,1024], //Max heap
        [sorts.minheap,1024], //Min heap
    ],
    insertion: [
        [sorts.insertion,256], //Insertion
        [sorts.binary_insertion,256], //Binary Insertion
        [sorts.shell,512], //Shell
        // [sorts.binary_shell,128], //Binary Shell
    ],
    merge: [
        [sorts.merge,1024], //Merge
        [sorts.bottomup_merge,1024], //Bottom-up Merge
    ],
    distribute: [
        [sorts.counting,1024], //Counting
        [sorts.pigeonhole,1024], //Pigeonhole
        [sorts.radix_lsd,1024,4], //Radix LSD base 4
        [sorts.radix_lsd,1024,16], //Radix LSD base 16
        [sorts.radix_msd,1024,4], //Radix MSD base 4
        [sorts.radix_msd,1024,16], //Radix MSD base 16
    ],
    impractical: [
        [sorts.pancake,128], //Pancake
        [sorts.time,512], //Pancake
        [sorts.stooge,64], //Stooge
        [sorts.bogo,6], //Bogo
    ]
}

scripts.all = [scripts.exchange,scripts.selection,scripts.insertion,scripts.merge,scripts.distribute,scripts.impractical].reduce((a,b) => {a.push(...b);return a});