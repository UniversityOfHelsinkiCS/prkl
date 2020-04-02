import React from 'react';
import Groups from './Groups';
import { GENERATE_GROUPS } from '../../GqlQueries';
import { Header, Button, Loader, Icon } from 'semantic-ui-react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { useQuery, useMutation } from '@apollo/react-hooks';

export default ({ courseId }) => {
    const [generateGroups] = useMutation(GENERATE_GROUPS);

    const handleGroupCreation = async () => {
        const variables = { data: { courseId: courseId } };
        if (window.confirm('Are you sure you want to generate groups?')) {
            try {
                await generateGroups({
                    variables,
                });
                window.location.reload();
            } catch (groupError) {
                console.log('error:', groupError);
            }
        }
    };
    return (
        <div>
            <Button onClick={handleGroupCreation} color="orange">
                <FormattedMessage id="course.generateGroups" />
            </Button>
            <Groups courseId={courseId} />
        </div>

    )
}