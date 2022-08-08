sorts.stooge = {
    run: async function () {

        sort.set_delay(5000/Math.pow(sort.arr.length,2.7));

        async function recursive (l,r) {

            if (r-l <= 1) {
                if (await sort.compareind.greater(l,r)) await sort.write.swap(l,r);
                return;
            }
        
            let i = [Math.round((l+2*r)/3),Math.round((2*l+r)/3)];
            
            await recursive(l,i[0]);
            await recursive(i[1],r);
            await recursive(l,i[0]);
        
        }

        await recursive(0, sort.arr.length - 1);

    },
    name: "Stooge Sort"
}

sorts.bogo = {
    run: async function () {

        sort.set_delay(0.1);
        
        while (!await sort.compareind.verify()) {
            await sort.write.randomize();
        }

    },
    name: "Bogo Sort"
}