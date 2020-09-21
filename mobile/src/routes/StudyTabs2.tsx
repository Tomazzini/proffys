import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TeacherList from '../pages/TeacherList';
import Favorites from '../pages/Favorites';

const { Navigator, Screen } = createBottomTabNavigator();

function Studytabs() {
    return (
        <Navigator>
            <Screen 
                name='Favorites' 
                component={Favorites} 
            />
        </Navigator>
        
    );
}

export default Studytabs;