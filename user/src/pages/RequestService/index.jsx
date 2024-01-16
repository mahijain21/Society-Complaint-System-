import {
  ChakraProvider,
  theme,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Stack,
  Button,
  Input,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Select as ChakraSelect } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserDBNavBar from '../../components/User/UserDBNavBar';
import FadeInUp from '../../components/Animation/FadeInUp';
import data from './complaints.json';
import Select from 'react-select';

export default function ServiceRequest() {
  const navigate = useNavigate();
  const [complaint_json, setComplaintJSON] = useState(null);
  const [sub_cat, setSubCat] = useState(null);
  const [subCatList, setSubCatList] = useState([]);

  const [Category, setCategory] = useState('');
  const [SubCategory, setSubCategory] = useState('');
  const [Post, setPost] = useState(null);
  const [Description, setDescription] = useState('');

  const handleCategoryChange = obj => {
    setComplaintJSON(obj);
    setSubCatList(obj.subcats);
    setCategory(obj.complaint);
  };
  const handleSubCategoryChange = obj => {
    setSubCat(obj);
    setSubCategory(obj.name);
    setPost(obj.code);
  };
  const [msg, setmsg] = useState('Please fill the following details');
  const [S_EID, setEID] = useState('');
  const [S_name, setName] = useState('');
  const [S_designation, setdesignation] = useState('');
  const [S_phone, setphone] = useState('');
  const [S_sector, setsector] = useState('');
  const [S_block, setblock] = useState('');
  const [S_qrtr, setqrtr] = useState('');

  const handleSectorChange = e => setsector(e.target.value);
  const handleBlockChange = e => setblock(e.target.value);
  const handleQrtrChange = e => setqrtr(e.target.value);
  const handleDescriptionChange = e => setDescription(e.target.value);

  useEffect(() => {
    //Runs only on the first render
    try {
      console.log(localStorage.getItem('tokenID'));
      fetch('/user/dashboard/requestform', {
        method: 'GET',
        headers: {
          token: localStorage.getItem('tokenID'),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then(response => {
        response.json().then(response => {
          console.log(response);
          setEID(response.EID);
          setName(response.name);
          setdesignation(response.designation);
          setphone(response.phone);
          setsector(response.sector);
          setblock(response.block);
          setqrtr(response.qrtr);
        });
      });
    } catch (err) {
      console.log('Error occured ');
      console.log(err);
    }
  }, []);

  const navigato_UDB = async event => {
    navigate('/user/dashboard');
  };
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const category = Category.toUpperCase();
      const subcategory = SubCategory;
      const description = Description;
      const EID = S_EID;
      const name = S_name;
      const designation = S_designation;
      const phone = S_phone;
      const sector = S_sector;
      const block = S_block;
      const qrtr = S_qrtr;

      let dat = await axios.post(
        'http://localhost:8000/user/dashboard/request',
        {
          EID,
          name,
          designation,
          phone,
          sector,
          block,
          qrtr,
          category,
          subcategory,
          description,
          Post
        }
      );
      console.log(dat);
      console.log('status : ' + dat.status);
      if (dat.status == 201) {
        console.log('Service Request Successfully placed ');
        setmsg('Service Request Successfully placed');
      } else {
        setmsg("Couldn't place Service Request");
        console.log("Couldn't place Service Request");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <UserDBNavBar name={S_name} />
      <FadeInUp>
        <Flex
          minH={'93vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
              <Heading fontSize={'4xl'}> Service Request Form</Heading>
              <Text fontSize={'lg'} color={'gray.600'}>
                {msg}
              </Text>
            </Stack>
            <Box
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.700')}
              boxShadow={'lg'}
              p={8}
            >
              <Stack spacing={4}>
                <form onSubmit={handleSubmit}>
                  <Text>Emp ID : {S_EID}</Text>
                  <Text>Design :{S_designation}</Text>
                  <Text>Name : Mr. {S_name}</Text>
                  <Text>Contact : {S_phone}</Text>
                  <Text>
                    Address : {S_sector}-{S_block}/{S_qrtr}
                  </Text>
                  <br />
                  <FormControl id="complaint-address">
                    <FormLabel>Sector</FormLabel>
                    <ChakraSelect
                      placeholder={S_sector}
                      onChange={handleSectorChange}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </ChakraSelect>
                    <FormLabel>Block</FormLabel>
                    <Input
                      placeholder={S_block}
                      type="number"
                      onChange={handleBlockChange}
                    ></Input>
                    <FormLabel>Quarter</FormLabel>
                    <ChakraSelect
                      placeholder={S_qrtr}
                      onChange={handleQrtrChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl id="complaint-category">
                    <FormLabel>Category</FormLabel>
                    <Select
                      placeholder="Select Category"
                      value={complaint_json}
                      options={data}
                      onChange={handleCategoryChange}
                      getOptionLabel={x => x.complaint}
                      getOptionValue={x => x.complaint}
                    ></Select>
                  </FormControl>

                  <FormControl id="subcategory">
                    <FormLabel>Complaint</FormLabel>
                    <Select
                      placeholder="Select Complaint"
                      onChange={handleSubCategoryChange}
                      value={sub_cat}
                      options={subCatList}
                      getOptionLabel={x => x.name}
                      getOptionValue={x => x.code}
                    ></Select>
                  </FormControl>
                  <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="Please provide a description for the service request."
                      onChange={handleDescriptionChange}
                    />
                  </FormControl>
                  <Stack spacing={10}>
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                      my={'1rem'}
                      type="submit"
                    >
                      Submit Request
                    </Button>
                  </Stack>
                </form>
                <Stack spacing={10}>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    onClick={navigato_UDB}
                  >
                    Back to DashBoard
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </FadeInUp>
    </ChakraProvider>
  );
}
