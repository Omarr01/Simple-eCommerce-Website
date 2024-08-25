import React from 'react';
import { ApolloConsumer } from '@apollo/client';

function withApolloConsumer(Component) {
    return (props) => (
        <ApolloConsumer>
            {client => <Component {...props} client={client} />}
        </ApolloConsumer>
    )
}

export default withApolloConsumer;