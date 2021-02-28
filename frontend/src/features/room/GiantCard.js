import React, { Component } from "react";
import { useActiveCard } from "../../contexts/ActiveCardContext";
import { getVisibleFace, getVisibleFaceSRC } from "./Helpers";

export const GiantCard = (PlayerN) => {
  const activeCardAndLoc = useActiveCard();
  const activeCard = activeCardAndLoc?.card
  const visibleFace = getVisibleFace(activeCard, PlayerN)
  if (activeCard) {
    return (
    <img 
      className="absolute"
      src={getVisibleFaceSRC(activeCard, PlayerN)}
      style={{
        right: activeCardAndLoc?.screenPosition === "left" ? "3%" : "",
        left: activeCardAndLoc?.screenPosition === "right" ? "3%" : "",
        top: "5%",
        borderRadius: '5%',
        backgroundColor: "red",
        MozBoxShadow: '0 0 50px 20px black',
        WebkitBoxShadow: '0 0 50px 20px black',
        boxShadow: '0 0 50px 20px black',
        zIndex: 1e6,
        width: visibleFace.height >= visibleFace.width ? "25%" : "35%",
      }}
    >
    </img>
      // <GiantCardImg src={getCurrentFaceSRC(activeCard,PlayerN)} activeCardAndLoc={activeCardAndLoc}></GiantCardImg>
    )
  } else {
    return(null)
  }
}

class GiantCardImg extends Component {
  constructor(props) {
        super(props);
        this.state = {dimensions: {}};
        this.onImgLoad = this.onImgLoad.bind(this);
  }
  onImgLoad({target:img}) {
    this.setState({dimensions:{cardHeight:img.offsetHeight, cardWidth:img.offsetWidth}});
  }
  render(){
    const src = this.props.src;
    const activeCardAndLoc = this.props.activeCardAndLoc;
    const {cardWidth, cardHeight} = this.state.dimensions;
    if (1) {
      return (
        <img 
          className="absolute"
          src={src}
          style={{
            right: activeCardAndLoc?.screenPosition === "left" ? "3%" : "",
            left: activeCardAndLoc?.screenPosition === "right" ? "3%" : "",
            top: "5%",
            borderRadius: '5%',
            backgroundColor: "red",
            MozBoxShadow: '0 0 50px 20px black',
            WebkitBoxShadow: '0 0 50px 20px black',
            boxShadow: '0 0 50px 20px black',
            zIndex: 1e6,
            width: cardHeight >= cardWidth ? "25%" : "35%",
            visibility: cardWidth ? "visible" : "hidden",
          }}
          onLoad={this.onImgLoad}
        >
        </img>
      )
    } else {
      return (null)
    }
  }
 }
  
export default GiantCard;