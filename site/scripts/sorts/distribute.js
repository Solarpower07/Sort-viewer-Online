sorts.pigeonhole = {
    run: async function () {

        sort.set_delay(2000/sort.arr.length);

        let min = 0, max = 0;

        for (let i = 0; i <= sort.arr.length; i++) {
            if (sort.arr[i] < sort.arr[min]) min = i;
            if (sort.arr[i] > sort.arr[max]) max = i;
        }

        let holes = Array.from({length: sort.arr[max] - sort.arr[min] + 1});

        for (let i = 0; i < sort.arr.length; i++) {
            holes[await sort.get(i) - sort.arr[min]] = sort.arr[i];
            sort.values.writes_aux++;
        }

        for (let i = 0; i < holes.length; i++) {
            await sort.write.write(i,holes[i]);
        }

    },
    name: "Pigeonhole Sort"
}