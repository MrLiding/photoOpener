import { Panel, PanelHeader, Button, Group, Div, FormItem, Input, Spacing, Snackbar } from '@vkontakte/vkui';
import { Icon28ErrorCircleOutline } from '@vkontakte/icons';
import PropTypes, { string } from 'prop-types';
import React from 'react'
import bridge from '@vkontakte/vk-bridge';

bridge.send("VKWebAppInit");

export const Home = ({ id, fetchedUser }) => {
  const [link, setLink] = React.useState('');
  const [purpose, setPurpose] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState(null);

  const onChange = (e) => {
    const { name, value } = e.currentTarget;

    const setStateAction = {
      link: setLink,
      purpose: setPurpose,
    }[name];

    setStateAction && setStateAction(value);
  };

  const openError = () => {
    if (snackbar) return;
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
      >
        Не удалось открыть фото
      </Snackbar>,
    );
  };

  const openErrorShare = () => {
    if (snackbar) return;
    setSnackbar(
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
      >
        Не удалось разместить фото
      </Snackbar>,
    );
  };

  const image_open = async () => {
    if (link.includes(".jpg") || link.includes(".jpeg") || link.includes(".webp"))
    {
      setLoading(true)
      bridge.send('VKWebAppShowImages',{
      images: [
        link
      ]
      })
      .then((data) => { 
        if (data.result) {
          // Нативный экран открыт
          setLoading(false)
        }
      })
      .catch((error) => {
        // Ошибка
        openError();
        console.log(error);
        setLoading(false)
      });
    }
    else {
      openError();
    }
  }

  const image_share = async () => {
    if (link.includes(".jpg") || link.includes(".jpeg") || link.includes(".webp"))
    {
      bridge.send('VKWebAppShowWallPostBox', {
        message: 'Смотри, какая классная фотка!',
        attachments: link
        })
        .then((data) => { 
          if (data.post_id) {
            // Запись размещена
          }
        })
        .catch((error) => {
          // Ошибка
          openErrorShare();
          console.log(error);
        });
    }
    else {
      openErrorShare();
    }
  }
  
  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
        <Group>
          <Div>
          </Div>
            <FormItem
              htmlFor="link"
              top="Ссылка на фото (.jpg/.jpeg/.webp)"
              status={link ? 'valid' : 'error'}
              bottom={
                link ? '' : 'Пожалуйста, введите ссылку'
              }
              bottomId="link-type"
            >
              <Input
                aria-labelledby="link-type"
                id="link"
                type="link"
                name="link"
                value={link}
                required
                onChange={onChange}
              />
            </FormItem>
            <Button
              stretched={true}
              loading={loading}
              size="l"
              align="center"
              sizeY="regular"
              onClick={() => {
                image_open()
              }}
            >
              Открыть фото
            </Button>
            <Spacing size={12}/>
            <Button
              stretched={true}
              loading={loading}
              size="l"
              align="center"
              sizeY="regular"
              onClick={() => {
                image_share()
              }}
            >
              Разместить на стене
            </Button>
        </Group>
        {snackbar}
    </Panel>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired,
  fetchedUser: PropTypes.shape({
    photo_200: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    city: PropTypes.shape({
      title: PropTypes.string,
    }),
  }),
};
