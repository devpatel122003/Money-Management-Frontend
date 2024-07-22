import React from 'react';

class Contact extends React.PureComponent {
  render() {
    return (
      <div style={styles.container}>
        <h1>Contact Page</h1>
        <p>Get in touch with us.</p>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '2rem'
  }
};

export default Contact;
