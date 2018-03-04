import React from 'react'
import PropTypes from 'prop-types'


/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
class About extends React.Component {

  constructor(props) {
    super(props);
    this.imageRef = {};
  }

  doStuff(event) {
    console.log('doStuff()');
    console.log(event);
    console.log(this.imageRef);

    // const newOpacity = this.imageRef.style.opacity - .1;
    // this.imageRef.style.opacity = newOpacity;
  };

  render() {

    const {dumb, dumber} = this.props;

    return (
      <div>
        <p>About Section - good times forever and now this is a thing</p>
        <p>dumb = {dumb}</p>
        <p>dumber = {dumber}</p>
        <p>bears in purple underwears</p>
        <img ref={(ref) => { this.imageRef = ref; }} onClick={this.doStuff} src="https://www.buildabear.com/dw/image/v2/BBNG_PRD/on/demandware.static/-/Sites-buildabear-master/default/dw7f46f212/24075x.jpg?sw=600&sh=600&sm=fit"/>
        <img src="https://s-media-cache-ak0.pinimg.com/736x/85/a7/f5/85a7f5cee4c93cb3995d1b51e3a0289f.jpg" />
      </div>
    );
  }
}

//
// const About = ({
//   dumb, dumber
// }) => {
//
//   const doStuff = (event) => {
//     console.log('doStuff()');
//     console.log(event);
//     // const newOpacity = .5;
//     // this.imageRef.style.opacity = newOpacity;
//   }
//
//   return (
//     <div>
//       <p>About Section - good times forever and now this is a thing</p>
//       <p>dumb = {dumb}</p>
//       <p>dumber = {dumber}</p>
//       <p>bears in purple underwears</p>
//       <img ref={(ref) => { this.imageRef = ref; }} onClick={doStuff} src="https://www.buildabear.com/dw/image/v2/BBNG_PRD/on/demandware.static/-/Sites-buildabear-master/default/dw7f46f212/24075x.jpg?sw=600&sh=600&sm=fit"/>
//       <img src="https://s-media-cache-ak0.pinimg.com/736x/85/a7/f5/85a7f5cee4c93cb3995d1b51e3a0289f.jpg" />
//     </div>
//   );
// }

About.propTypes = {
  /** Description of prop "dumb" and you are the coolest. can you see this now */
  dumb: PropTypes.string.isRequired,
  /** Description of prop "dumber". */
  dumber: PropTypes.string
};

export default About;