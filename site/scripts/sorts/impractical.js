sorts.pancake = {
    run: async function () {

        sort.set_delay(5000/Math.pow(sort.arr.length,2));
        
        for (let max = sort.arr.length; max > 0; max--) {
            
            let biggest = await sort.compareind.max(0,max-1);

            await sort.write.invert(0,biggest);

            await sort.write.invert(0,max-1);
        
        }

    },
    name: "Pancake Sort"
}

sorts.stooge = {
    run: async function () {

        sort.set_delay(3000/Math.pow(sort.arr.length,2.7));

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

sorts.time = {
    run: async function () {

        sort.set_delay(2500/sort.arr.length);

        let holes = Array.from({length: sort.arr.length});

        for (let i = 0; i < sort.arr.length; i++) {
            sort.values.writes_aux++;
            holes[i] = await sort.get(i);
        }

        //Cheat, give the illusion of noisiness
    
        for (let cur_i = 0; cur_i < holes.length; cur_i++) {
    
            let ran_i = cur_i + Math.floor(Math.random() * (holes.length - cur_i));
            
            [holes[ran_i],holes[cur_i]] = [holes[cur_i],holes[ran_i]];
    
        }

        let gap = holes.length;

        while (gap > 2) {

            if (gap > 1) gap = Math.floor(gap / 1.3);

            for (let i = 0; i < holes.length - gap; i++) {

                if (holes[i] > holes[i + gap]) [holes[i],holes[i + gap]] = [holes[i + gap],holes[i]];

            }
        
        }

        //Done with cheat


        //Copy array over

        sort.set_delay(15);

        for (let i = 0; i < holes.length; i++) {
            sort.values.delay += 0.01 + (Math.random() * 0.001) - 0.0005;
            await sort.write.write(i,holes[i]);
        }

        //Insertion sort to fix it up

        sort.set_delay(35000/Math.pow(sort.arr.length,2));

        for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {

            let replace = sort.arr[cur_i];

            let i = cur_i - 1;
        
            while (i >= 0 && await sort.compare.less(replace, await sort.get(i))) {
            
                await sort.write.overwrite(i + 1, i);
            
                i--;
            
            }

            await sort.write.write(i+1,replace);
        
        }

    },
    name: "Time Sort, Mul 10"
}