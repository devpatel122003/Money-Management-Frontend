import React from 'react';

class About extends React.PureComponent {
  render() {
    return (
      <div style={styles.container}>
        <h1>About Page</h1>
        <p>Learn more about us on this page.</p>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '2rem'
  }
};

export default About;
