import React from 'react';
import Groups from './Groups';
import { GENERATE_GROUPS } from '../../GqlQueries';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';

export default ({ courseId, registrations }) => {
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
            {registrations.length === 0 ? (
                <div>
                    <h3>
                        <FormattedMessage id="groupsView.noRegistrations" />
                    </h3>
                </div>
            ) : (<div>
                <Button onClick={handleGroupCreation} color="orange">
                    <FormattedMessage id="course.generateGroups" />
                </Button>
                <Groups courseId={courseId} />
            </div>
                )}
        </div>

    )
}