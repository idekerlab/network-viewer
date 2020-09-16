import CyReference from '../model/CyReference'

const fitContent = (cyReference: CyReference): void => {
  const { main, sub } = cyReference

  if (main !== undefined && main !== null) {
    main.fit()
  }

  if (sub !== undefined && sub !== null) {
    sub.fit()
  }
}


const lockMainWindow = (cyReference: CyReference, lock: boolean): void => {

  const main = cyReference.main
  if(main === undefined) {
    return
  }

  main.boxSelectionEnabled( lock )
  if(lock) {
    main.nodes().grabify()
    main.nodes().unlock()
    main.elements().selectify()
  } else {
    main.nodes().ungrabify()
    main.nodes().lock()
    main.elements().unselectify()
  }

}

export { fitContent, lockMainWindow }
