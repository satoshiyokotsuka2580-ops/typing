import { loadDictionary } from "@scriptin/jmdict-simplified-loader";

const source = process.argv[2];
let shown = false;

loadDictionary("jmdict", source)
  .onEntry((entry) => {
    if (!shown) {
      shown = true;
      console.dir(entry, {
        depth: 6,
        maxArrayLength: 3
      });
    }
  })
  .onEnd(() => {
    console.log("確認完了");
  });
