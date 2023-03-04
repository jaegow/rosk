import React, {FC} from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sectionId = 'ExamplePage';

interface ExamplePageProps {
    foo: string;
    bar: number;
}

const ExamplePage: FC<ExamplePageProps> = ({foo, bar}) => {

    return (
        <div data-testid={sectionId} >
            <p>Example Page is working...</p>
            <p>foo: {foo}</p>
            <p>bar: {bar}</p>
        </div>
    );
};

export default ExamplePage;
export type {ExamplePageProps};
export {sectionId};
