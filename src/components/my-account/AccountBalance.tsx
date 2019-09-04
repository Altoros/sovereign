import React, {HTMLAttributes, useState} from 'react';
import styled, {css} from 'styled-components';
import {Card} from 'rebass';
import {useWeb3Context} from 'web3-react';

import ButtonLine from '../common/ButtonLine';
import {getTokenDataBySymbol} from '../common/img/token-icons';
import DepositModal from '../deposit';
import {LoginModal} from '../login';
import WithdrawModal from '../withdraw';

import {themeColors} from '../../util/constants';

interface Props extends HTMLAttributes<HTMLDivElement> {
  isLoggedIn: boolean;
  marketsData: Markets;
  redirect: (path: string) => void;
}

interface State {
  depositModalIsOpen: boolean;
  withdrawModalIsOpen: boolean;
}

const Table = styled.table`
  margin: 15px auto;
  max-width: 1100px;
`;

const TR = styled.tr`
  &:last-child {
    > td {
      border-bottom: none;
    }
  }
`;

const THead = styled.thead``;
const TBody = styled.tbody``;

const cellCSS = css`
  border-bottom: 1px solid ${themeColors.borderColor};
  font-size: 15px;
  line-height: 1.2;
  padding: 8px 12px;
  white-space: nowrap;
`;

const TH = styled.th<{textAlign?: string; width: string}>`
  ${cellCSS}
  color: #444;
  font-weight: 600;
  text-align: ${props => props.textAlign};
  width: ${props => props.width};
`;

TH.defaultProps = {
  textAlign: 'right',
};

const TD = styled.td<{textAlign?: string}>`
  ${cellCSS}
  color: ${themeColors.tertiaryTextColor};
  font-feature-settings: 'tnum' 1;
  font-weight: 400;
  text-align: ${props => props.textAlign};
`;

TD.defaultProps = {
  textAlign: 'right',
};

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: auto;
  max-width: 200px;

  > button {
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const TableOverflow = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const TokenData = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`;

const TokenImage = styled.div<{image: any}>`
  background-image: url('${props => props.image}');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: contain;
  flex-grow: 0;
  flex-shrink: 0;
  height: 25px;
  margin-right: 15px;
  width: 25px;
`;

const Title = styled.h1`
  color: ${themeColors.baseTextColor};
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
`;

const AccountBalance: React.FC<Props> = (props: Props) => {
  const {marketsData, isLoggedIn, ...restProps} = props;
  const [depositModalIsOpen, setDepositModalIsOpen] = useState(false);
  const [withdrawModalIsOpen, setWithdrawModalIsOpen] = useState(false);
  const [loginModalIsOpen, setModalIsOpen] = useState(false);
  const [currentMarket, setCurrentMarket] = useState<Market | null>(null);

  const context = useWeb3Context();

  const openDepositModal = () => setDepositModalIsOpen(true);
  const closeDepositModal = () => setDepositModalIsOpen(false);
  const openWithdrawModal = () => setWithdrawModalIsOpen(true);
  const closeWithdrawModal = () => setWithdrawModalIsOpen(false);
  const openLoginModal = () => {
    if (context.account) {
      props.redirect('/my-account');
    }
    setModalIsOpen(true);
  };
  const closeLoginModal = () => setModalIsOpen(false);

  const deposit = (market: Market) => {
    openDepositModal();
    setCurrentMarket(market);
  };

  const withdraw = (market: Market) => {
    openWithdrawModal();
    setCurrentMarket(market);
  };

  return (
    <Card {...restProps} sx={{width: isLoggedIn ? 1100 : 700, margin: 'auto'}}>
      <Title>{isLoggedIn ? 'My Account' : 'Current Rates'}</Title>
      <TableOverflow>
        <Table>
          <THead>
            <TR>
              <TH textAlign="left" width="20%">
                Asset
              </TH>
              <TH width="15%">Price</TH>
              <TH width="15%">Interest Rate</TH>
              {isLoggedIn ? (
                <>
                  <TH width="15%">Wallet Balance</TH>
                  <TH width="15%">Deposit Balance</TH>
                </>
              ) : null}
              <TH width="20%">&nbsp;</TH>
            </TR>
          </THead>
          <TBody>
            {marketsData.map((market, index) => {
              const tokenData = getTokenDataBySymbol(market.symbol);
              const image = tokenData ? tokenData.image : '';
              return (
                <TR key={index}>
                  <TD textAlign="left">
                    <TokenData>
                      <TokenImage image={image} />
                      <strong>{market.symbol}</strong>
                    </TokenData>
                  </TD>
                  <TD>${market.price}</TD>
                  <TD>
                    {isLoggedIn ? null : 'Earn'} {market.interestRate}%
                  </TD>
                  {isLoggedIn ? (
                    <>
                      <TD>{market.walletBalance ? market.walletBalance.format() : '-'}</TD>
                      <TD>{market.depositBalance ? market.depositBalance.format() : '-'}</TD>
                    </>
                  ) : null}
                  <TD>
                    <ButtonsContainer>
                      {isLoggedIn ? (
                        <>
                          <ButtonLine onClick={() => deposit(market)}>Deposit</ButtonLine>
                          <ButtonLine onClick={() => withdraw(market)}>Withdraw</ButtonLine>
                        </>
                      ) : (
                        <ButtonLine onClick={openLoginModal}>Start Earning</ButtonLine>
                      )}
                    </ButtonsContainer>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </TableOverflow>
      <DepositModal market={currentMarket} isOpen={depositModalIsOpen} onRequestClose={closeDepositModal} />
      <WithdrawModal market={currentMarket} isOpen={withdrawModalIsOpen} onRequestClose={closeWithdrawModal} />
      <LoginModal isOpen={loginModalIsOpen} onRequestClose={closeLoginModal} redirect={props.redirect} />
    </Card>
  );
};

export default AccountBalance;
