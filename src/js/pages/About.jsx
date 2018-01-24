import React from 'react'
import PropTypes from 'prop-types'


/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
const About = ({
  dumb, dumber
}) => (
  <div>
    <p>About Section - good times forever</p>
    <p>dumb = {dumb}</p>
    <p>dumber = {dumber}</p>
  </div>
);

About.propTypes = {
  /** Description of prop "dumb" and you are the coolest. */
  dumb: PropTypes.string.isRequired,
  /** Description of prop "dumber". */
  dumber: PropTypes.string
};

export default About;