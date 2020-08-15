import CyReference from '../model/CyReference'

const fitContent = (cyReference: CyReference): void => {
  const { main, sub } = cyReference

  if (main !== undefined) {
    console.log('main %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FIT:', cyReference)
    main.fit()
  }

  if (sub !== undefined) {
    console.log('sub %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FIT:', cyReference)
    sub.fit()
  }
}

export { fitContent }
