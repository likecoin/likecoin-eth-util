'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var createLedgerWeb3 = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
    var networkId = _ref2.networkId,
        accountsLength = _ref2.accountsLength,
        rpcUrl = _ref2.rpcUrl;

    var _ref3, _ref4, ProviderEngine, FetchSubprovider, TransportU2F, createLedgerSubprovider, engine, getTransport, ledger;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Promise.all([import( /* webpackChunkName: "ledger" */'web3-provider-engine/dist/es5'), import( /* webpackChunkName: "ledger" */'web3-provider-engine/dist/es5/subproviders/fetch'), import( /* webpackChunkName: "ledger" */'@ledgerhq/hw-transport-u2f'), import( /* webpackChunkName: "ledger" */'@ledgerhq/web3-subprovider')]);

          case 2:
            _ref3 = _context.sent;
            _ref4 = _slicedToArray(_ref3, 4);
            ProviderEngine = _ref4[0];
            FetchSubprovider = _ref4[1];
            TransportU2F = _ref4[2];
            createLedgerSubprovider = _ref4[3];

            if (ProviderEngine.default) ProviderEngine = ProviderEngine.default;
            if (FetchSubprovider.default) FetchSubprovider = FetchSubprovider.default;
            if (TransportU2F.default) TransportU2F = TransportU2F.default;
            if (createLedgerSubprovider.default) createLedgerSubprovider = createLedgerSubprovider.default;
            engine = new ProviderEngine();

            getTransport = function getTransport() {
              return TransportU2F.create();
            };

            ledger = createLedgerSubprovider(getTransport, {
              networkId: networkId,
              accountsLength: accountsLength
            });

            engine.addProvider(ledger);
            engine.addProvider(new FetchSubprovider({ rpcUrl: rpcUrl }));
            engine.start();
            return _context.abrupt('return', new _web2.default(engine));

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createLedgerWeb3(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-underscore-dangle */


var abiDecoder = require('@likecoin/abi-decoder/dist/es5');

var DEFAULT_CONFIRMATION_NEEDED = 6;

function timeout(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function prettifyNumber(n) {
  var s = n.toString(10);
  var start = 0;
  var until = (s.length + 2) % 3 + 1;
  var arr = [];
  while (start < s.length) {
    arr.push(s.substr(start, until - start));
    start = until;
    until += 3;
  }
  return arr.join(' ');
}

var EthHelper = function () {
  function EthHelper() {
    _classCallCheck(this, EthHelper);
  }

  _createClass(EthHelper, [{
    key: 'initApp',
    value: function initApp(params) {
      Object.assign(this, _extends({}, params, {
        wallet: ''
      }));

      if (this.contractConfig) {
        abiDecoder.addABI(this.contractConfig.abi);
      }
      if (!this.confirmationNeeded) this.confirmationNeeded = DEFAULT_CONFIRMATION_NEEDED;

      this.pollForWeb3();
    }
  }, {
    key: 'clearTimers',
    value: function clearTimers() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
        this.pollingTimer = null;
      }
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
    }
  }, {
    key: 'pollForWeb3',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(initType) {
        var _this = this;

        var network, provider;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.isInited = false;
                this.clearTimers();
                _context2.prev = 2;

                if (!(initType || typeof window !== 'undefined' && typeof window.web3 !== 'undefined')) {
                  _context2.next = 18;
                  break;
                }

                if (!(initType === 'ledger' && this.web3Type !== 'ledger')) {
                  _context2.next = 11;
                  break;
                }

                _context2.next = 7;
                return createLedgerWeb3(_extends({}, this.ledgerConfig, {
                  rpcUrl: this.infuraHost
                }));

              case 7:
                this.web3 = _context2.sent;

                this.setWeb3Type('ledger');
                _context2.next = 12;
                break;

              case 11:
                if (!this.web3 || this.web3Type !== 'window') {
                  this.setWeb3Type('window');
                  this.web3 = new _web2.default(window.web3.currentProvider);
                }

              case 12:
                _context2.next = 14;
                return this.web3.eth.net.getNetworkType();

              case 14:
                network = _context2.sent;

                if (network === this.targetNetwork) {
                  if (this.retryCb) this.retryCb();
                  this.startApp();
                  this.isInited = true;
                } else {
                  if (this.errCb) this.errCb('testnet');
                  this.retryTimer = setTimeout(function () {
                    return _this.pollForWeb3(initType);
                  }, 3000);
                }
                _context2.next = 21;
                break;

              case 18:
                if (this.errCb) this.errCb('web3');
                if (this.web3Type !== 'infura') {
                  provider = new _web2.default.providers.HttpProvider(this.infuraHost);

                  this.web3 = new _web2.default(provider);
                  this.setWeb3Type('infura');
                }
                this.retryTimer = setTimeout(function () {
                  return _this.pollForWeb3(initType);
                }, 3000);

              case 21:
                _context2.next = 28;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2['catch'](2);

                console.error(_context2.t0);
                this.clearTimers();
                this.retryTimer = setTimeout(function () {
                  return _this.pollForWeb3(initType);
                }, 2000);

              case 28:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 23]]);
      }));

      function pollForWeb3(_x2) {
        return _ref5.apply(this, arguments);
      }

      return pollForWeb3;
    }()
  }, {
    key: 'startApp',
    value: function startApp() {
      var _this2 = this;

      var contractConfig = this.contractConfig,
          icoContractConfig = this.icoContractConfig;

      if (contractConfig) {
        this.contract = new this.web3.eth.Contract(contractConfig.abi, contractConfig.address);
      }
      if (icoContractConfig) {
        this.icoContract = new this.web3.eth.Contract(icoContractConfig.abi, icoContractConfig.address);
      }

      this.getAccounts();
      this.pollingTimer = setInterval(function () {
        return _this2.getAccounts();
      }, 3000);
    }
  }, {
    key: 'getAccounts',
    value: function getAccounts() {
      var _this3 = this;

      this.web3.eth.getAccounts().then(function (accounts) {
        if (accounts && accounts[0]) {
          if (_this3.wallet !== accounts[0]) {
            _this3.accounts = accounts;

            var _accounts = _slicedToArray(accounts, 1);

            _this3.wallet = _accounts[0];


            if (_this3.onWalletCb) _this3.onWalletCb(_this3.wallet);
            if (_this3.clearErrCb) _this3.clearErrCb();
          }
        } else if (_this3.isInited && _this3.errCb) {
          _this3.wallet = '';
          _this3.errCb('locked');
        }
      });
    }
  }, {
    key: 'setLedgerOn',
    value: function setLedgerOn() {
      this.pollForWeb3('ledger');
    }
  }, {
    key: 'resetWeb3',
    value: function resetWeb3() {
      this.pollForWeb3('window');
    }
  }, {
    key: 'waitForTxToBeMined',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(txHash) {
        var done, _ref7, _ref8, t, txReceipt, currentBlockNumber;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                done = false;

              case 1:
                if (done) {
                  _context3.next = 16;
                  break;
                }

                _context3.next = 4;
                return timeout(1000);

              case 4:
                _context3.next = 6;
                return Promise.all([this.web3.eth.getTransaction(txHash), this.web3.eth.getTransactionReceipt(txHash), this.web3.eth.getBlockNumber()]);

              case 6:
                _ref7 = _context3.sent;
                _ref8 = _slicedToArray(_ref7, 3);
                t = _ref8[0];
                txReceipt = _ref8[1];
                currentBlockNumber = _ref8[2];

                if (!(txReceipt && (txReceipt.status === 0 || txReceipt.status === '0x0'))) {
                  _context3.next = 13;
                  break;
                }

                throw new Error('Transaction failed');

              case 13:
                done = t && txReceipt && currentBlockNumber && t.blockNumber && currentBlockNumber - t.blockNumber > this.confirmationNeeded;
                _context3.next = 1;
                break;

              case 16:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function waitForTxToBeMined(_x3) {
        return _ref6.apply(this, arguments);
      }

      return waitForTxToBeMined;
    }()
  }, {
    key: 'utf8ToHex',
    value: function utf8ToHex(data) {
      return this.web3.utils.utf8ToHex(data);
    }
  }, {
    key: 'setWeb3Type',
    value: function setWeb3Type(type) {
      this.web3Type = type;
      if (this.onSetWeb3) this.onSetWeb3(type);
    }
  }, {
    key: 'getWallet',
    value: function getWallet() {
      return this.wallet;
    }
  }, {
    key: 'getIsSupportTransferDelegated',
    value: function getIsSupportTransferDelegated() {
      /* Trust not support Bignumber yet */
      if (this.web3Type === 'window' && typeof window !== 'undefined' && window.web3 && window.web3.currentProvider.isTrust) {
        return false;
      }
      return this.web3Type !== 'ledger' && this.web3Type !== 'infura';
    }
  }, {
    key: 'getTransactionCompleted',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(txHash) {
        var _ref10, _ref11, t, currentBlockNumber, _ref12, _ref13, r, block;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return Promise.all([this.web3.eth.getTransaction(txHash), this.web3.eth.getBlockNumber()]);

              case 2:
                _ref10 = _context4.sent;
                _ref11 = _slicedToArray(_ref10, 2);
                t = _ref11[0];
                currentBlockNumber = _ref11[1];

                if (!(!t || !currentBlockNumber)) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt('return', 0);

              case 8:
                if (!(t.blockNumber && currentBlockNumber - t.blockNumber > this.confirmationNeeded)) {
                  _context4.next = 16;
                  break;
                }

                _context4.next = 11;
                return Promise.all([this.web3.eth.getTransactionReceipt(txHash), this.web3.eth.getBlock(t.blockNumber)]);

              case 11:
                _ref12 = _context4.sent;
                _ref13 = _slicedToArray(_ref12, 2);
                r = _ref13[0];
                block = _ref13[1];
                return _context4.abrupt('return', {
                  ts: block && r ? block.timestamp : 0,
                  isFailed: r && (r.status === false || r.status === '0x0')
                });

              case 16:
                return _context4.abrupt('return', {
                  ts: 0,
                  isFailed: false
                });

              case 17:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getTransactionCompleted(_x4) {
        return _ref9.apply(this, arguments);
      }

      return getTransactionCompleted;
    }()
  }, {
    key: 'getEthTransferInfo',
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(txHash, tx, blockNo) {
        var t, currentBlockNumber, _to, _from, _value, _ref15, _ref16, r, block;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                t = tx;
                currentBlockNumber = blockNo;

                if (t) {
                  _context5.next = 6;
                  break;
                }

                _context5.next = 5;
                return this.web3.eth.getTransaction(txHash);

              case 5:
                t = _context5.sent;

              case 6:
                if (blockNo) {
                  _context5.next = 10;
                  break;
                }

                _context5.next = 9;
                return this.web3.eth.getBlockNumber();

              case 9:
                currentBlockNumber = _context5.sent;

              case 10:
                if (!(!t || !currentBlockNumber)) {
                  _context5.next = 12;
                  break;
                }

                throw new Error('Cannot find transaction');

              case 12:
                _to = this.web3.utils.toChecksumAddress(t.to);
                _from = this.web3.utils.toChecksumAddress(t.from);
                _value = t.value;

                if (!(!t.blockNumber || currentBlockNumber - t.blockNumber < this.confirmationNeeded)) {
                  _context5.next = 17;
                  break;
                }

                return _context5.abrupt('return', {
                  isEth: true,
                  _from: _from,
                  _to: _to,
                  _value: _value
                });

              case 17:
                _context5.next = 19;
                return Promise.all([this.web3.eth.getTransactionReceipt(txHash), this.web3.eth.getBlock(t.blockNumber)]);

              case 19:
                _ref15 = _context5.sent;
                _ref16 = _slicedToArray(_ref15, 2);
                r = _ref16[0];
                block = _ref16[1];

                _to = this.web3.utils.toChecksumAddress(r.to);
                _from = this.web3.utils.toChecksumAddress(r.from);
                _value = t.value;
                return _context5.abrupt('return', {
                  isEth: true,
                  isFailed: r && (r.status === false || r.status === '0x0'),
                  _to: _to,
                  _from: _from,
                  _value: _value,
                  timestamp: block ? block.timestamp : 0
                });

              case 27:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getEthTransferInfo(_x5, _x6, _x7) {
        return _ref14.apply(this, arguments);
      }

      return getEthTransferInfo;
    }()
  }, {
    key: 'getTransferInfo',
    value: function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(txHash, opt) {
        var blocking, _ref18, _ref19, t, currentBlockNumber, _ref20, _ref21, decoded, isDelegated, isLock, txTo, _to, _from, _value, _ref22, _ref23, r, block, logs, targetLogs, _targetLogs, log, _targetLogs2, _targetLogs3, _log;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                blocking = opt.blocking;
                _context6.next = 3;
                return Promise.all([this.web3.eth.getTransaction(txHash), this.web3.eth.getBlockNumber()]);

              case 3:
                _ref18 = _context6.sent;
                _ref19 = _slicedToArray(_ref18, 2);
                t = _ref19[0];
                currentBlockNumber = _ref19[1];

              case 7:
                if (!((!t || !currentBlockNumber) && blocking)) {
                  _context6.next = 18;
                  break;
                }

                _context6.next = 10;
                return timeout(1000);

              case 10:
                _context6.next = 12;
                return Promise.all([this.web3.eth.getTransaction(txHash), this.web3.eth.getBlockNumber()]);

              case 12:
                _ref20 = _context6.sent;
                _ref21 = _slicedToArray(_ref20, 2);
                t = _ref21[0];
                currentBlockNumber = _ref21[1];
                _context6.next = 7;
                break;

              case 18:
                if (!(!t || !currentBlockNumber)) {
                  _context6.next = 20;
                  break;
                }

                throw new Error('Cannot find transaction');

              case 20:
                if (!(t.value > 0)) {
                  _context6.next = 22;
                  break;
                }

                return _context6.abrupt('return', this.getEthTransferInfo(txHash, t, currentBlockNumber));

              case 22:
                if (!(t.to.toLowerCase() !== this.contractConfig.address.toLowerCase())) {
                  _context6.next = 24;
                  break;
                }

                throw new Error('Not LikeCoin transaction');

              case 24:
                decoded = abiDecoder.decodeMethod(t.input);
                isDelegated = decoded.name === 'transferDelegated';
                isLock = decoded.name === 'transferAndLock';

                if (!(decoded.name !== 'transfer' && !isDelegated && !isLock)) {
                  _context6.next = 29;
                  break;
                }

                throw new Error('Not LikeCoin Store transaction');

              case 29:
                txTo = decoded.params.find(function (p) {
                  return p.name === '_to';
                }).value;
                _to = this.web3.utils.toChecksumAddress(txTo);
                _from = isDelegated ? decoded.params.find(function (p) {
                  return p.name === '_from';
                }).value : t.from;

                _from = this.web3.utils.toChecksumAddress(_from);
                _value = decoded.params.find(function (p) {
                  return p.name === '_value';
                }).value;

                if (!(!t.blockNumber || currentBlockNumber - t.blockNumber < this.confirmationNeeded)) {
                  _context6.next = 36;
                  break;
                }

                return _context6.abrupt('return', {
                  _from: _from,
                  _to: _to,
                  _value: _value
                });

              case 36:
                _context6.next = 38;
                return Promise.all([this.web3.eth.getTransactionReceipt(txHash), this.web3.eth.getBlock(t.blockNumber)]);

              case 38:
                _ref22 = _context6.sent;
                _ref23 = _slicedToArray(_ref22, 2);
                r = _ref23[0];
                block = _ref23[1];

                if (!(!r || r.status === false || r.status === '0x0')) {
                  _context6.next = 44;
                  break;
                }

                return _context6.abrupt('return', {
                  isFailed: r && (r.status === false || r.status === '0x0'),
                  _to: _to,
                  _from: _from,
                  _value: _value,
                  timestamp: block ? block.timestamp : 0
                });

              case 44:
                if (!(!r.logs || !r.logs.length)) {
                  _context6.next = 46;
                  break;
                }

                throw new Error('Cannot fetch transaction Data');

              case 46:
                logs = abiDecoder.decodeLogs(r.logs);

                if (!isDelegated) {
                  _context6.next = 57;
                  break;
                }

                targetLogs = logs.filter(function (l) {
                  return l.events.find(function (e) {
                    return e.name === 'to';
                  }).value.toLowerCase() === txTo.toLowerCase();
                });

                if (!(!targetLogs || !targetLogs.length)) {
                  _context6.next = 51;
                  break;
                }

                throw new Error('Cannot parse receipt');

              case 51:
                _targetLogs = _slicedToArray(targetLogs, 1), log = _targetLogs[0];

                _to = this.web3.utils.toChecksumAddress(log.events.find(function (p) {
                  return p.name === 'to';
                }).value);
                _from = isDelegated ? this.web3.utils.toChecksumAddress(log.events.find(function (p) {
                  return p.name === 'from';
                }).value) : t.from;
                _value = log.events.find(function (p) {
                  return p.name === 'value';
                }).value;
                _context6.next = 64;
                break;

              case 57:
                if (!isLock) {
                  _context6.next = 64;
                  break;
                }

                _targetLogs2 = logs.filter(function (l) {
                  return l.name === 'Transfer';
                });

                if (!(!_targetLogs2 || !_targetLogs2.length)) {
                  _context6.next = 61;
                  break;
                }

                throw new Error('Cannot parse receipt');

              case 61:
                _targetLogs3 = _slicedToArray(_targetLogs2, 1), _log = _targetLogs3[0];

                _to = this.web3.utils.toChecksumAddress(_log.events.find(function (p) {
                  return p.name === 'to';
                }).value);
                _value = _log.events.find(function (p) {
                  return p.name === 'value';
                }).value;

              case 64:
                return _context6.abrupt('return', {
                  _to: _to,
                  _from: _from,
                  _value: _value,
                  timestamp: block ? block.timestamp : 0
                });

              case 65:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getTransferInfo(_x8, _x9) {
        return _ref17.apply(this, arguments);
      }

      return getTransferInfo;
    }()
  }, {
    key: 'queryLikeCoinBalance',
    value: function () {
      var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(addr) {
        var address;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                address = addr || this.wallet || '';

                if (address) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt('return', '');

              case 3:
                return _context7.abrupt('return', this.contract.methods.balanceOf(address).call());

              case 4:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function queryLikeCoinBalance(_x10) {
        return _ref24.apply(this, arguments);
      }

      return queryLikeCoinBalance;
    }()
  }, {
    key: 'queryEthBalance',
    value: function () {
      var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(addr) {
        var address;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                address = addr || this.wallet || '';

                if (address) {
                  _context8.next = 3;
                  break;
                }

                return _context8.abrupt('return', '');

              case 3:
                return _context8.abrupt('return', this.web3.eth.getBalance(address));

              case 4:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function queryEthBalance(_x11) {
        return _ref25.apply(this, arguments);
      }

      return queryEthBalance;
    }()
  }, {
    key: 'queryKYCStatus',
    value: function () {
      var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(addr) {
        var address;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                address = addr || this.wallet || '';

                if (address) {
                  _context9.next = 3;
                  break;
                }

                return _context9.abrupt('return', false);

              case 3:
                return _context9.abrupt('return', this.icoContract.methods.kycDone(address).call());

              case 4:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function queryKYCStatus(_x12) {
        return _ref26.apply(this, arguments);
      }

      return queryKYCStatus;
    }()
  }, {
    key: 'getAddressPurchaseEvents',
    value: function () {
      var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(addr) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt('return', this.icoContract.getPastEvents('Purchase', {
                  fromBlock: 0,
                  filter: {
                    _addr: addr
                  }
                }));

              case 1:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getAddressPurchaseEvents(_x13) {
        return _ref27.apply(this, arguments);
      }

      return getAddressPurchaseEvents;
    }()
  }, {
    key: 'getAddressPurchaseTotal',
    value: function () {
      var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(addr) {
        var _this4 = this;

        var address;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                address = addr || this.wallet || '';
                _context11.next = 3;
                return this.getAddressPurchaseEvents(address);

              case 3:
                _context11.t0 = function (acc, e) {
                  return {
                    coin: acc.coin.add(new _this4.web3.utils.BN(e.returnValues._coins)),
                    eth: acc.eth.add(new _this4.web3.utils.BN(e.returnValues._ethers))
                  };
                };

                _context11.t1 = { coin: new this.web3.utils.BN(0), eth: new this.web3.utils.BN(0) };
                return _context11.abrupt('return', _context11.sent.reduce(_context11.t0, _context11.t1));

              case 6:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getAddressPurchaseTotal(_x14) {
        return _ref28.apply(this, arguments);
      }

      return getAddressPurchaseTotal;
    }()
  }, {
    key: 'genTypedSignData',
    value: function () {
      var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(from, to, value, maxReward) {
        var nonce;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                nonce = void 0;

              case 1:
                nonce = this.web3.utils.randomHex(32);

              case 2:
                _context12.next = 4;
                return this.contract.methods.usedNonce(from, nonce).call();

              case 4:
                if (_context12.sent) {
                  _context12.next = 1;
                  break;
                }

              case 5:
                return _context12.abrupt('return', [{ type: 'address', name: 'contract', value: this.contractConfig.address }, { type: 'string', name: 'method', value: 'transferDelegated' }, { type: 'address', name: 'to', value: to }, { type: 'uint256', name: 'value', value: prettifyNumber(value) }, { type: 'uint256', name: 'maxReward', value: prettifyNumber(maxReward) }, { type: 'uint256', name: 'nonce', value: nonce }]);

              case 6:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function genTypedSignData(_x15, _x16, _x17, _x18) {
        return _ref29.apply(this, arguments);
      }

      return genTypedSignData;
    }()
  }, {
    key: 'sendAsync',
    value: function sendAsync(obj) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.web3.currentProvider.sendAsync(obj, function (err, result) {
          if (err) {
            reject(err);
          } else if (result.error) {
            reject(result.error);
          } else {
            resolve(result.result || result);
          }
        });
      });
    }
  }, {
    key: 'signTyped',
    value: function () {
      var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(signData, from) {
        var result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                _context13.next = 3;
                return this.sendAsync({
                  method: 'eth_signTypedData',
                  params: [signData, from],
                  from: from
                });

              case 3:
                result = _context13.sent;
                return _context13.abrupt('return', result);

              case 7:
                _context13.prev = 7;
                _context13.t0 = _context13['catch'](0);

                console.error(_context13.t0);

              case 10:
                return _context13.abrupt('return', '');

              case 11:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 7]]);
      }));

      function signTyped(_x19, _x20) {
        return _ref30.apply(this, arguments);
      }

      return signTyped;
    }()
  }, {
    key: 'signTransferDelegated',
    value: function () {
      var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(to, value, maxReward) {
        var from, signData, nonce, rawSignature, signature, postData;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (this.getIsSupportTransferDelegated()) {
                  _context14.next = 2;
                  break;
                }

                return _context14.abrupt('return', Promise.reject(new Error('Not Supported')));

              case 2:
                if (this.onSign) this.onSign();
                from = this.getWallet();
                _context14.next = 6;
                return this.genTypedSignData(from, to, value, maxReward);

              case 6:
                signData = _context14.sent;
                nonce = signData.filter(function (param) {
                  return param.name === 'nonce';
                })[0].value;
                _context14.next = 10;
                return this.signTyped(signData, from);

              case 10:
                rawSignature = _context14.sent.substr(2);

                if (this.onSigned) this.onSigned();

                if (rawSignature) {
                  _context14.next = 14;
                  break;
                }

                return _context14.abrupt('return', Promise.reject(new Error('Signing Rejected')));

              case 14:
                signature = '0x' + rawSignature;
                postData = {
                  from: from,
                  to: to,
                  value: value.toString(10),
                  maxReward: maxReward.toString(10),
                  nonce: nonce,
                  signature: signature
                };
                return _context14.abrupt('return', Promise.resolve(postData));

              case 17:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function signTransferDelegated(_x21, _x22, _x23) {
        return _ref31.apply(this, arguments);
      }

      return signTransferDelegated;
    }()
  }, {
    key: 'sendTransaction',
    value: function () {
      var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(to, value) {
        var _this6 = this;

        var _ref33 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            gasPrice = _ref33.gasPrice,
            gasLimit = _ref33.gasLimit;

        var txEventEmitter;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (this.isInited) {
                  _context15.next = 2;
                  break;
                }

                return _context15.abrupt('return', Promise.reject(new Error('No web3')));

              case 2:
                if (this.onSign) this.onSign();
                txEventEmitter = new Promise(function (resolve, reject) {
                  _this6.web3.eth.sendTransaction({
                    from: _this6.wallet,
                    to: to,
                    value: value,
                    gasPrice: gasPrice,
                    gasLimit: gasLimit
                  }).on('transactionHash', function (hash) {
                    if (_this6.onSigned) _this6.onSigned();
                    resolve(hash);
                  }).on('error', function (err) {
                    if (_this6.onSigned) _this6.onSigned();
                    reject(err);
                  });
                });
                return _context15.abrupt('return', txEventEmitter);

              case 5:
              case 'end':
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function sendTransaction(_x24, _x25) {
        return _ref32.apply(this, arguments);
      }

      return sendTransaction;
    }()
  }, {
    key: 'signLogin',
    value: function () {
      var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(payload) {
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (this.isInited) {
                  _context16.next = 2;
                  break;
                }

                return _context16.abrupt('return', Promise.reject(new Error('No web3')));

              case 2:
                if (this.onLogin) this.onLogin();
                return _context16.abrupt('return', this.personalSign(payload));

              case 4:
              case 'end':
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function signLogin(_x27) {
        return _ref34.apply(this, arguments);
      }

      return signLogin;
    }()
  }, {
    key: 'signUserPayload',
    value: function () {
      var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(payload) {
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (this.isInited) {
                  _context17.next = 2;
                  break;
                }

                return _context17.abrupt('return', Promise.reject(new Error('No web3')));

              case 2:
                if (this.onSign) this.onSign();
                return _context17.abrupt('return', this.personalSign(payload));

              case 4:
              case 'end':
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function signUserPayload(_x28) {
        return _ref35.apply(this, arguments);
      }

      return signUserPayload;
    }()
  }, {
    key: 'personalSign',
    value: function () {
      var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(payload) {
        var from, rawSignature;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (this.isInited) {
                  _context18.next = 2;
                  break;
                }

                return _context18.abrupt('return', Promise.reject(new Error('No web3')));

              case 2:
                from = this.getWallet();
                _context18.prev = 3;
                _context18.next = 6;
                return this.web3.eth.personal.sign(payload, from);

              case 6:
                rawSignature = _context18.sent;

                if (this.onSigned) this.onSigned();

                if (rawSignature) {
                  _context18.next = 10;
                  break;
                }

                return _context18.abrupt('return', Promise.reject(new Error('Signing Rejected')));

              case 10:
                return _context18.abrupt('return', rawSignature);

              case 13:
                _context18.prev = 13;
                _context18.t0 = _context18['catch'](3);

                if (this.onSigned) this.onSigned();
                throw _context18.t0;

              case 17:
              case 'end':
                return _context18.stop();
            }
          }
        }, _callee18, this, [[3, 13]]);
      }));

      function personalSign(_x29) {
        return _ref36.apply(this, arguments);
      }

      return personalSign;
    }()
  }]);

  return EthHelper;
}();

exports.default = new EthHelper();