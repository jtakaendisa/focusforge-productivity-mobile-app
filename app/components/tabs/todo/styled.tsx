import { TextInput } from 'react-native';
import { View, Text, styled } from 'tamagui';

//Todo Screen
const Container = styled(View, {
  flex: 1,
  padding: 14,
  backgroundColor: 'white',
});

// TodoItem
const TaskContainer = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  padding: 6,
});

const Title = styled(Text, {
  fontSize: 16,
  color: '#303137',
});

// CreateTodoItem
const Input = styled(TextInput, {
  flex: 1,
  //@ts-ignore
  fontSize: 16,
});

export { Container, TaskContainer, Title, Input };
