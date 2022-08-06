let scripts = {
    exchange: [
        [sorts.bubble,128], //Bubble
        [sorts.cocktail,128], //Cocktail
        [sorts.gnome,128], //Gnome
        [sorts.quick,256], //Quick
    ],
    selection: [
        [sorts.selection,128], //Selection
        [sorts.cycle,128], //Cycle
        [sorts.maxheap,256], //Max heap
        [sorts.minheap,256], //Min heap
    ],
    merge: [
        [sorts.merge,256], //Merge
        [sorts.bottomup_merge,256], //Bottom-up Merge
    ],
    distribute: [
        [sorts.pigeonhole,256], //Pigeonhole
    ],
    impractical: [
        [sorts.stooge,64], //Stooge
        [sorts.bogo,6], //Bogo
    ]
}

scripts.all = [scripts.exchange,scripts.selection,scripts.merge,scripts.distribute,scripts.impractical].reduce((a,b) => {a.push(...b);return a});