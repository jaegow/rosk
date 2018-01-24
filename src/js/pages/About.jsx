import React from 'react'
import PropTypes from 'prop-types'


/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
const About = ({
  dumb, dumber
}) => (
  <div>
    <p>About Section - good times forevers</p>
    <p>dumb = {dumb}</p>
    <p>dumber = {dumber}</p> ///shit
  </div>
);

About.propTypes = {
  /** Description of prop "dumb". */
  dumb: PropTypes.string.isRequired,
  /** Description of prop "dumber". */
  dumber: PropTypes.string
};

export default About;