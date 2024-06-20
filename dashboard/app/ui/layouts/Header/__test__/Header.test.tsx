// Constants
import { AUTHENTICATION_ROLE } from '@/lib/constants';

// Utils
import { renderQueryProviderTest } from '@/lib/utils';

// Mocks
import { USER_DETAIL_MOCK } from '@/lib/mocks';

// Components
import Header from '@/ui/layouts/Header';

const mockSignOut = jest.fn();

const mockProps = {
  userId: USER_DETAIL_MOCK[0].uid,
  firstName: USER_DETAIL_MOCK[0].firstName,
  lastName: USER_DETAIL_MOCK[0].lastName,
  role: USER_DETAIL_MOCK[0].role,
  avatarURL: USER_DETAIL_MOCK[0].avatarURL,
  bonusTimes: USER_DETAIL_MOCK[0].bonusTimes,
  onSignOut: mockSignOut,
};

describe('Header component', () => {
  it('Should render match with snapshot.', () => {
    const { container } = renderQueryProviderTest(<Header {...mockProps} />);

    expect(container).toMatchSnapshot();
  });

  it('should call onSignOut when click Logout button', () => {
    const { getAllByText } = renderQueryProviderTest(
      <Header {...mockProps} role={AUTHENTICATION_ROLE.SUPER_ADMIN} />,
    );

    fireEvent.click(getAllByText('Logout')[0]);

    expect(mockSignOut).toHaveBeenCalled();
  });
});
