import React from 'react';
import DefaultLayout from './layouts/default';

export default function ResetPassword(props) {
  return (
    <DefaultLayout>
      <div id="reset-password" errors={JSON.stringify(props.errors)}>
      </div>
    </DefaultLayout>
  );
}
