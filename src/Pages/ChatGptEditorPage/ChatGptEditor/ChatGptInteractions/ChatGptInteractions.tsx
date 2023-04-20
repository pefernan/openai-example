import { Card, CardBody, Gallery, GalleryItem, Spinner } from "@patternfly/react-core";
import { ChatGptInteraction, RESPONSE_TYPE } from "../../api";
import { CheckCircleIcon, WarningTriangleIcon } from "@patternfly/react-icons";

type Props = {
  history: ChatGptInteraction[];
};

function getIcon(interaction: ChatGptInteraction): JSX.Element {
    if(!interaction.response) {
        return <Spinner isInline isSVG size="sm"/>
    }
    return interaction.response.type === RESPONSE_TYPE.SUCCES ? <CheckCircleIcon size="sm"/> : <WarningTriangleIcon size="sm" />
}

export const ChatGptInteractions: React.FC<Props> = ({ history }) => {

  return (
    <Gallery>
      {history.map((interaction) => {
        return (
          <GalleryItem>
            <Card isCompact>
              <CardBody>
                {getIcon(interaction)}&nbsp;{interaction.request}
                </CardBody>
            </Card>
          </GalleryItem>
        );
      })}
    </Gallery>
  );
};
