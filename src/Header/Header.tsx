import React from 'react';
import { Masthead, MastheadContent, MastheadMain, Title } from '@patternfly/react-core';
import { ReactComponent as OpenAILogo } from './openai.svg'


export function Header() {
    return <Masthead>
        <MastheadMain>
            <OpenAILogo width={40} height={40} fill={"white"}/> 
        </MastheadMain>
        <MastheadContent>
        <Title headingLevel="h1">OpenaAI Tests</Title>
        </MastheadContent>
    </Masthead>
}