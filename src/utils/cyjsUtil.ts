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
  if(main === undefined || main === null) {
    return
  }

  if(lock) {
    main.boxSelectionEnabled( !lock )
    main.nodes().ungrabify()
    main.nodes().lock()
    main.elements().unselectify()
  } else {
    main.boxSelectionEnabled( !lock )
    main.nodes().grabify()
    main.nodes().unlock()
    main.elements().selectify()
  }

}

export { fitContent, lockMainWindow }
