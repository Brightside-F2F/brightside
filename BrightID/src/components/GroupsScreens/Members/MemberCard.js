// @flow

import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { photoDirectory } from '@/utils/filesystem';
import moment from 'moment';
import { DEVICE_TYPE } from '@/utils/constants';
import ActionSheet from 'react-native-actionsheet';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

const ICON_SIZE = DEVICE_TYPE === 'large' ? 36 : 32;
const ACTION_ADD_ADMIN = 'Add Admin';
const ACTION_DISMISS = 'Dismiss from group';
const ACTION_CANCEL = 'Cancel';

type MemberCardProps = {
  memberId: string,
  userId: string,
  photo: Photo,
  name: string,
  connectionDate: number,
  handleDismiss: (...args: Array<any>) => any,
  handleAddAdmin: (...args: Array<any>) => any,
  userIsAdmin: boolean,
  memberIsAdmin: boolean,
  flaggers: any,
};

function MemberCard(props: MemberCardProps) {
  const {
    memberId,
    userId,
    photo,
    name,
    connectionDate,
    handleDismiss,
    handleAddAdmin,
    userIsAdmin,
    memberIsAdmin,
    flaggers,
    testID,
  } = props;
  const actionSheetRef: ?ActionSheet = useRef(null);
  const [contextActions, setContextActions] = useState<Array<string>>([]);
  const [flagged, setFlagged] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  // set possible actions depending on user and member admin status
  useEffect(() => {
    const actions: Array<string> = [];
    if (userIsAdmin) {
      if (!memberIsAdmin) {
        // member can be promoted to admin
        actions.push(ACTION_ADD_ADMIN);
      }
      if (userId !== memberId) {
        // member can be dismissed from group
        actions.push(ACTION_DISMISS);
      }
    }
    if (actions.length > 0) {
      actions.push(ACTION_CANCEL);
    }
    setContextActions(actions);
  }, [userIsAdmin, memberIsAdmin, userId, memberId]);

  // show flagged status of member?
  useEffect(() => {
    if (!userIsAdmin) {
      // only admins can see flags
      setFlagged(false);
    } else {
      setFlagged(flaggers && Object.keys(flaggers).length);
    }
  }, [flaggers, userIsAdmin]);

  const performAction = (index: number) => {
    const action = contextActions[index];
    console.log(`Performing action ${action}`);
    switch (action) {
      case ACTION_DISMISS:
        handleDismiss({ id: memberId, name });
        break;
      case ACTION_ADD_ADMIN:
        handleAddAdmin({ id: memberId, name });
        break;
      case ACTION_CANCEL:
      default:
      // do nothing
    }
  };

  const imageSource =
    photo?.filename && !imgErr
      ? {
          uri: `file://${photoDirectory()}/${photo?.filename}`,
        }
      : require('@/static/default_profile.jpg');

  const memberTestID = memberIsAdmin ? 'admin' : 'regular';
  return (
    <View testID={memberTestID}>
      <View style={styles.container} testID={testID}>
        <Image
          source={imageSource}
          style={styles.photo}
          onError={() => {
            console.log('settingImgErr');
            setImgErr(true);
          }}
          accessibilityLabel="profile picture"
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.statusContainer}>
            {flagged ? <Text style={styles.flagged}>(flagged)</Text> : null}
          </View>
          {connectionDate > 0 && (
            <Text style={styles.connectedText}>
              Connected {moment(connectionDate).fromNow()}
            </Text>
          )}
        </View>
        {contextActions.length > 0 && (
          <TouchableOpacity
            testID="memberContextBtn"
            style={styles.moreIcon}
            onPress={() => {
              actionSheetRef?.current.show();
            }}
          >
            <Material name="dots-vertical" size={ICON_SIZE} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
      {contextActions.length > 0 && (
        <ActionSheet
          ref={actionSheetRef}
          title="What do you want to do?"
          options={contextActions}
          cancelButtonIndex={contextActions.indexOf(ACTION_CANCEL)}
          destructiveButtonIndex={contextActions.indexOf(ACTION_DISMISS)}
          onPress={performAction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    height: DEVICE_TYPE === 'large' ? 94 : 80,
    marginBottom: DEVICE_TYPE === 'large' ? 11.8 : 6,
    shadowColor: 'rgba(0,0,0,0.32)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.43,
    shadowRadius: 4,
  },
  photo: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginLeft: 14,
  },
  info: {
    marginLeft: 25,
    flex: 1,
    height: DEVICE_TYPE === 'large' ? 71 : 65,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  name: {
    fontFamily: 'ApexNew-Book',
    fontSize: DEVICE_TYPE === 'large' ? 20 : 18,
    shadowColor: 'rgba(0,0,0,0.32)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  flagged: {
    fontFamily: 'ApexNew-Medium',
    fontSize: 14,
    color: 'red',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  connectedText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 12,
    color: '#aba9a9',
    fontStyle: 'italic',
  },
  moreIcon: {
    marginRight: 16,
  },
});

export default MemberCard;
