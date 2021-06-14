import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import Characteristics from '../components/Characteristics';
import Logo from '../assets/images/logo.svg';

export default function AddForm({ onAddOrganizationsAndAnimals }) {
  const initialOrganization = {
    name: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
  };

  const initialAnimal = {
    name: '',
    type: '',
    age: '',
    gender: '',
    breed: '',
    characteristics: [],
    description: '',
    picture: '',
  };

  const [organization, setOrganization] = useState(initialOrganization);
  const [animal, setAnimal] = useState(initialAnimal);

  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  console.log('animal', animal);

  const uploadImage = (image) => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'rjqeqskh');
    data.append('cloud_name', 'pawzies');
    fetch('https://api.cloudinary.com/v1_1/pawzies/image/upload', {
      method: 'POST',
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setAnimal({ ...animal, picture: data.url });
      })
      .catch((err) => console.log(err));
  };

  function handleFormSubmit(event) {
    event.preventDefault();
    onAddOrganizationsAndAnimals(organization, animal);
    setOrganization(initialOrganization);
    setAnimal(initialAnimal);
  }

  function updateOrganization(event) {
    const fieldName = event.target.name;
    let fieldValue = event.target.value;

    setOrganization({ ...organization, [fieldName]: fieldValue });
  }

  function updateAnimal(event) {
    const fieldName = event.target.name;
    let fieldValue = event.target.value;

    setAnimal({ ...animal, [fieldName]: fieldValue });
  }

  function updateImage(event) {
    const fileSize = event.target.files[0].size;
    if (fileSize > 2097152) {
      alert(
        'Unfortunately, this Image is too big. Please choose another one that is less than 2MB'
      );
    } else uploadImage(event.target.files[0]);
  }

  function removeTrait(removeTrait) {
    const remainingItems = animal.characteristics.filter(
      (trait) => trait !== removeTrait
    );
    setAnimal({ ...animal, characteristics: [...remainingItems] });
  }

  function updateTraits(newTrait) {
    setAnimal({
      ...animal,
      characteristics: [...animal.characteristics, newTrait],
    });
  }

  return (
    <FormWrapper>
      <LogoWrapper>
        <LogoImage src={Logo} alt='Logo of Pawzies' />
      </LogoWrapper>
      <h1>
        Add Your Organization and Animal to <span>Pawzies</span>
      </h1>
      <Form onSubmit={handleFormSubmit}>
        <P>Please specify your organization below</P>
        <label htmlFor='name'>Name</label>
        <Input
          type='text'
          name='name'
          placeholder='Name of your Organization'
          value={organization.name}
          onChange={updateOrganization}
        />
        <label htmlFor='email'>E-Mail</label>
        <Input
          type='text'
          name='email'
          placeholder='E-Mail of your Organization'
          value={organization.email}
          onChange={updateOrganization}
        />
        <label htmlFor='phone'>Phone</label>
        <Input
          type='text'
          name='phone'
          placeholder='Phone Number of your Organization'
          value={organization.phone}
          onChange={updateOrganization}
        />
        <AddressWrapper>
          <h4>Address</h4>
          <label htmlFor='street'>Street</label>
          <Input
            type='text'
            name='street'
            placeholder='Street'
            value={organization.street}
            onChange={updateOrganization}
          />
          <label htmlFor='zip'>ZIP Code</label>
          <Input
            type='text'
            name='zip'
            placeholder='ZIP Code'
            value={organization.zip}
            onChange={updateOrganization}
          />
          <label htmlFor='city'> City</label>
          <Input
            type='text'
            name='city'
            placeholder='City / Location'
            value={organization.city}
            onChange={updateOrganization}
          />
        </AddressWrapper>
        <P>
          Please provide the following information about the Animal you wish to
          add:
        </P>
        <label htmlFor='picture'>Profile Picture</label>
        <P isDescription>Upload a picture of the animal</P>
        <Button onClick={handleClick}>Upload a file</Button>
        <Input
          type='file'
          name='picture'
          accept='.jpg,.jpeg,.png,.svg'
          onChange={updateImage}
          style={{ display: 'none' }}
          ref={hiddenFileInput}
        />
        <label htmlFor='name'>Name</label>
        <Input
          type='text'
          name='name'
          placeholder='Name of the Animal'
          value={animal.name}
          onChange={updateAnimal}
        />
        <label htmlFor='type'>Type</label>
        <Select
          name='type'
          id='type'
          value={animal.type}
          onChange={updateAnimal}>
          <option value=''>Select the Animal Type</option>
          <option value='cat'>Cat</option>
          <option value='dog'>Dog</option>
          <option value='small_animals'>Small Animals</option>
        </Select>
        <label htmlFor='age'>Age</label>
        <AgeInput
          type='number'
          name='age'
          placeholder='Age'
          value={animal.age}
          onChange={updateAnimal}
        />

        <label htmlFor='gender'>Gender</label>
        <RadioWrapper>
          <label className='radio'>
            <span className='radio__input'>
              <input
                type='radio'
                name='gender'
                value='female'
                checked={animal.gender === 'female'}
                onChange={updateAnimal}
              />
              <span className='radio__control'></span>
            </span>
            <span className='radio__label'>Female</span>
          </label>
          <label className='radio'>
            <span className='radio__input'>
              <input
                type='radio'
                name='gender'
                value='male'
                checked={animal.gender === 'male'}
                onChange={updateAnimal}
              />
              <span className='radio__control'></span>
            </span>
            <span className='radio__label'>Male</span>
          </label>
        </RadioWrapper>

        <label htmlFor='breed'>Breed</label>
        <Input
          type='text'
          name='breed'
          placeholder='Breed of the Animal'
          value={animal.breed}
          onChange={updateAnimal}
        />
        <Characteristics
          traits={animal.characteristics}
          onRemoveTrait={removeTrait}
          onUpdateTraits={updateTraits}
        />
        <label htmlFor='description'>Description</label>
        <Textarea
          name='description'
          id='description'
          placeholder='Tell us a bit about the Animal'
          value={animal.description}
          onChange={updateAnimal}
          cols='30'
          rows='10'
        />
        <Link style={{ textDecoration: 'none' }} to='/'>
          <Button type='button'>Go Back</Button>
        </Link>
        <Button>SUBMIT</Button>
      </Form>
    </FormWrapper>
  );
}

const LogoWrapper = styled.div`
  display: grid;
  place-items: center;
  background: var(--gray);
  filter: drop-shadow(0 0 0.8rem var(--black));
  margin-bottom: 1.3rem;
  padding: 1.3rem;
  width: 10rem;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
`;

const LogoImage = styled.img`
  width: 10rem;
`;

const FormWrapper = styled.section`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  color: var(--secondary);
  font-weight: bold;
  background-image: linear-gradient(to right, #ff758c 0%, #ff7eb3 100%);
  margin: 0;

  h1 {
    padding: 0 1.5rem;
    text-align: center;
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  span {
    color: var(--black);
    font-weight: normal;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  gap: 0.5rem;

  background-color: rgba(217, 219, 227, 30%);
  border-radius: 0.8rem;
  font-size: 1.5rem;
  margin: 1rem;
  padding: 0.5rem;

  span {
    color: var(--secondary);
  }
`;

const P = styled.p`
  color: ${(props) =>
    props.isDescription ? 'var(--black)' : 'var(--primary-dark)'};
  margin: 0.5rem 0;
  padding: 0 1.7rem;
  text-align: center;
  font-size: ${(props) => (props.isDescription ? '1.2rem' : '1.5rem')};
  font-weight: ${(props) => (props.isDescription ? 'normal' : 'bold')};
`;

const Input = styled.input`
  align-self: center;
  background-color: var(--blue-dark);
  border: 1px inset var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-size: 1rem;
  height: 2.5rem;
  text-align: center;
  width: ${(props) => (props.isRadio ? '1.5rem' : '70vw')};

  &:focus {
    outline-color: var(--white);
  }

  &::placeholder {
    color: darkgray;
  }
`;

const Select = styled.select`
  background-color: var(--blue-dark);
  border: 1px inset var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-size: 1rem;
  height: 2.5rem;
  text-align-last: center;
  width: 70vw;
`;

const AgeInput = styled(Input)`
  width: 30vw;
  margin-bottom: 0.5rem;
`;

const AddressWrapper = styled.section`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  margin-bottom: 2rem;

  h4 {
    margin: 0.3rem 0;
  }
`;

const RadioWrapper = styled.section`
  color: white;
  .radio {
    color: var(--primary);
    font-size: 1.5rem;
    display: grid;
    grid-template-columns: min-content auto;
    grid-gap: 0.5em;
    align-items: baseline;
    margin-bottom: 1rem;

    &:focus-within {
      .radio__label {
        transform: scale(1.05);
        opacity: 1;
      }
    }

    .radio__input {
      display: flex;
      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .radio__control {
        display: grid;
        place-items: center;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        border: 0.1em solid currentColor;
        transform: translateY(-0.05em);
        color: var(--blue-dark);
      }

      input + .radio__control::before {
        content: '';
        width: 0.5em;
        height: 0.5em;
        box-shadow: inset 0.5em 0.5em currentColor;
        border-radius: 50%;
        transition: 180ms transform ease-in-out;
        transform: scale(0);
      }

      input:checked + .radio__control::before {
        transform: scale(1);
      }

      .radio__label {
        line-height: 1;
        transition: 180ms all ease-in-out;
        opacity: 0.8;
      }
    }
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--gray);
  border-radius: 100vw;
  cursor: pointer;
  font-family: var(--ff-cursive);
  font-size: 1.3rem;
  padding: 0.5rem;
  width: 9rem;

  img {
    width: 1rem;
  }
`;

const Textarea = styled.textarea`
  background-color: var(--blue-dark);
  resize: none;

  align-self: center;
  border: 1px inset var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-size: 1rem;
  font-family: sans-serif;
  text-align: center;
  padding: 1rem;
  width: ${(props) => (props.isRadio ? '1.5rem' : '70vw')};

  &:focus {
    outline-color: var(--white);
  }

  &::placeholder {
    color: darkgray;
  }
`;
