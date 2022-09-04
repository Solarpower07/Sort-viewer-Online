let scripts = {
    exchange: [
        [sorts.bubble,128], //Bubble
        [sorts.optimized_bubble,128], //Optimized Bubble
        [sorts.cocktail,128], //Cocktail
        [sorts.optimized_cocktail,128], //Optimized Cocktail
        [sorts.gnome,128], //Gnome
        [sorts.oddeven,128], //Odd-even
        [sorts.comb,256], //Comb
        [sorts.quick,256], //Quick
    ],
    selection: [
        [sorts.selection,128], //Selection
        [sorts.cycle,128], //Cycle
        [sorts.pigeonhole_cycle,256], //Pigeonhole Cycle
        [sorts.maxheap,256], //Max heap
        [sorts.minheap,256], //Min heap
    ],
    insertion: [
        [sorts.insertion,128], //Insertion
        [sorts.binary_insertion,128], //Binary Insertion
        [sorts.shell,256], //Shell
        // [sorts.binary_shell,128], //Binary Shell
    ],
    merge: [
        [sorts.merge,256], //Merge
        // [sorts.bottomup_merge,256], //Bottom-up Merge
    ],
    distribute: [
        [sorts.counting,256], //Counting
        [sorts.pigeonhole,256], //Pigeonhole
        [sorts.radix_lsd,256], //Radix LSD
        [sorts.radix_msd,256], //Radix MSD
    ],
    impractical: [
        [sorts.pancake,128], //Pancake
        [sorts.stooge,64], //Stooge
        [sorts.bogo,6], //Bogo
    ]
}

scripts.all = [scripts.exchange,scripts.selection,scripts.insertion,scripts.merge,scripts.distribute,scripts.impractical].reduce((a,b) => {a.push(...b);return a});