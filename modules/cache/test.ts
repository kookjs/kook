import Cache from './index'
import MemoryEngine from './MemoryEngine'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}   
const main = async () => {
  const typeCache = new Cache({
    engine: new MemoryEngine()
  })

  await typeCache.set('name', 'aman', "60000")
  // await sleep(10000);
  // await typeCache.set('name2', 'aman2')
  // // typeCache.del('name')
  console.log(await typeCache.get('name'))
  // console.log(await typeCache.get('name2'))
}

main()