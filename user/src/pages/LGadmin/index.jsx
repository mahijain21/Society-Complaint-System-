import {
  ChakraProvider,
  theme,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FadeInUp from '../../components/Animation/FadeInUp';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [AID, setAID] = useState('20930132');
  const [password, setpassword] = useState('123456');
  const [msg, setmsg] = useState('Please fill in your credentials');
  const [stat, setStat] = useState('Sign in');
  const handleAIDChange = e => setAID(e.target.value);
  const handlepasswordChange = e => setpassword(e.target.value);

  useEffect(() => {
    localStorage.setItem('AdminTokenID', token);
  }, [token]);

  const handleSubmit = async event => {
    event.preventDefault();
    console.log(AID);
    console.log(password);

    try {
      let dat = await axios.post('http://localhost:8000/admin/login', {
        AID,
        password,
      });

      console.log(dat.data.admin);
      const stringToken = '' + dat.data.token;
      console.log('String Token : ' + stringToken);
      setToken(dat.data.token);
      console.log(dat.data.token);

      if (dat.status === 200) {
        setmsg('Successful signin');
        setStat('Signin successful')
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setStat('Please Try Again');
        setmsg('INCORRECT CREDENTIALS');
      }
      console.log('status for admin : ' + dat.status);
    } catch (error) {
        setStat('Please Try Again');
        setTimeout(() => {
          setStat('Sign in');
          setmsg('Please fill in your credentials')
        }, 3000)
        setmsg('INCORRECT CREDENTIALS');
      console.log(error);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <FadeInUp>
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.10', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}>Sign in to your account</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                Administrator Login
              </Text>
              <Text>{msg}</Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <form onSubmit={handleSubmit}>
                  <FormControl id="AID">
                    <FormLabel>ADMIN ID</FormLabel>
                    <Input
                      type="text"
                      id="AID"
                      value={AID}
                      onChange={handleAIDChange}
                    />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={handlepasswordChange}
                    />
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}
                    >
                      <Checkbox>Remember me</Checkbox>
                      <Link color={'blue.400'}>Forgot password?</Link>
                    </Stack>
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                      type="submit"
                    >
                      {stat}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </FadeInUp>
    </ChakraProvider>
  );
}
