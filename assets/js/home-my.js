const flow = window.SweetyFlow;

const updateScale = flow?.updateScale ?? (() => {
  const baseWidth = 402;
  const baseHeight = 874;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scale = Math.min(viewportWidth / baseWidth, viewportHeight / baseHeight);
  const artboard = document.querySelector(".artboard");

  if (!artboard) {
    return;
  }

  artboard.style.transform = `translate(-50%, -50%) scale(${scale})`;
});

const runAfterNextPaint = flow?.runAfterNextPaint ?? ((callback) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      callback();
    });
  });
});

function runEntryAnimation() {
  const root = document.querySelector(".my-root");

  if (!root) {
    return;
  }

  runAfterNextPaint(() => {
    root.classList.add("is-entered");
  });
}

function setupBottomSheet() {
  const screen = document.querySelector(".screen");
  const openButton = document.getElementById("createAccountBtn");
  const closeButton = document.getElementById("bottomSheetClose");

  if (!screen || !openButton || !closeButton) {
    return;
  }

  openButton.addEventListener("click", () => {
    screen.classList.add("is-sheet-open");
  });

  closeButton.addEventListener("click", () => {
    screen.classList.remove("is-sheet-open");
  });
}

function setupPasswordVisibilityToggles() {
  const passwordWraps = document.querySelectorAll(".my-password-wrap");

  passwordWraps.forEach((passwordWrap) => {
    const input = passwordWrap.querySelector(".my-field-input");
    const toggleButton = passwordWrap.querySelector(".my-eye-btn");

    if (!input || !toggleButton) {
      return;
    }

    const syncToggleState = () => {
      const isHidden = input.type === "password";
      toggleButton.classList.toggle("is-active", isHidden);
      toggleButton.setAttribute("aria-pressed", String(isHidden));
      toggleButton.setAttribute("aria-label", isHidden ? "비밀번호 숨김 활성" : "비밀번호 표시 활성");
    };

    syncToggleState();

    toggleButton.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      syncToggleState();
    });
  });
}

function setupPasswordConditionChecklist() {
  const passwordInput = document.getElementById("myPassword");
  const conditionItems = document.querySelectorAll(".my-password-condition-list li[data-rule]");

  if (!passwordInput || conditionItems.length === 0) {
    return;
  }

  const checkRules = {
    lowercase: (value) => /[a-z]/.test(value),
    uppercase: (value) => /[A-Z]/.test(value),
    number: (value) => /\d/.test(value),
    special: (value) => /[!#*_%\.@]/.test(value),
    length: (value) => value.length >= 9,
  };

  const syncConditionState = () => {
    const value = passwordInput.value;

    conditionItems.forEach((item) => {
      const ruleName = item.dataset.rule;
      const isChecked = ruleName && checkRules[ruleName] ? checkRules[ruleName](value) : false;
      item.classList.toggle("is-checked", isChecked);
    });
  };

  syncConditionState();
  passwordInput.addEventListener("input", syncConditionState);
}

let signupToastTimerId = null;

function hideSignupToast() {
  const toast = document.getElementById("mySignupToast");

  if (!toast) {
    return;
  }

  toast.classList.remove("is-visible");

  if (signupToastTimerId) {
    clearTimeout(signupToastTimerId);
    signupToastTimerId = null;
  }
}

function getGreetingPeriodLabel() {
  const hour = new Date().getHours();

  if (hour >= 22 || hour < 5) {
    return "밤";
  }

  if (hour >= 5 && hour < 12) {
    return "아침";
  }

  if (hour >= 12 && hour < 18) {
    return "오후";
  }

  return "저녁";
}

function showSignupToast() {
  const toast = document.getElementById("mySignupToast");

  if (!toast) {
    return;
  }

  if (signupToastTimerId) {
    clearTimeout(signupToastTimerId);
  }

  toast.classList.add("is-visible");

  signupToastTimerId = setTimeout(() => {
    hideSignupToast();
  }, 4000);
}

function setupToastCloseButton() {
  const closeButton = document.getElementById("mySignupToastClose");

  if (!closeButton) {
    return;
  }

  closeButton.addEventListener("click", () => {
    hideSignupToast();
  });
}

function getMaskedGreetingName(name) {
  const trimmedName = name.trim();
  const isTwoOrThreeHangul = /^[가-힣]{2,3}$/.test(trimmedName);
  const isFourHangul = /^[가-힣]{4}$/.test(trimmedName);

  if (isTwoOrThreeHangul) {
    return trimmedName.slice(1);
  }

  if (isFourHangul) {
    return trimmedName.slice(2);
  }

  return trimmedName;
}

function applySignedInState(name) {
  const screen = document.querySelector(".screen");
  const root = document.querySelector(".my-root");
  const greetingLight = document.querySelector(".my-greeting .light");
  const greetingDark = document.querySelector(".my-greeting .dark");

  if (!screen || !root || !greetingLight || !greetingDark) {
    return;
  }

  const trimmedName = name.trim();
  const maskedName = getMaskedGreetingName(trimmedName);
  const greetingPeriod = getGreetingPeriodLabel();

  greetingLight.textContent = `좋은 ${greetingPeriod}입니다.`;
  greetingDark.textContent = `${maskedName}님.`;

  screen.classList.remove("is-sheet-open");
  root.classList.add("is-signed-in");

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  showSignupToast();
}

function setupFieldValidations() {
  const fields = {
    myName: document.getElementById("myName"),
    myPhone: document.getElementById("myPhone"),
    myEmail: document.getElementById("myEmail"),
    myPassword: document.getElementById("myPassword"),
    myPasswordConfirm: document.getElementById("myPasswordConfirm"),
  };
  const submitButton = document.querySelector(".my-create-account-btn");
  const validationMessages = document.querySelectorAll(".my-field-validation[data-validation-for]");

  if (!fields.myName || !fields.myPhone || !fields.myEmail || !fields.myPassword || !fields.myPasswordConfirm || !submitButton || validationMessages.length === 0) {
    return;
  }

  const messageMap = {};
  validationMessages.forEach((messageElement) => {
    const targetFieldId = messageElement.dataset.validationFor;
    if (targetFieldId) {
      messageMap[targetFieldId] = messageElement;
    }
  });

  const evaluatePassword = (value) => {
    if (!value) {
      return "패스워드를 입력해 주세요.";
    }

    if (/password|abc/i.test(value)) {
      return "이 비밀번호는 'password'나 'abc'와 같은 단순한 문구를 포함하고 있습니다. 기호 및/또는 숫자를 조합하여 복잡성을 높이거나 다른 단어/문구를 사용해 보세요.";
    }

    const hasLowercase = /[a-z]/.test(value);
    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!#*_%\.@]/.test(value);
    const hasMinLength = value.length >= 9;

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial || !hasMinLength) {
      return "영문 대/소문자, 숫자, 특수문자를 포함해 9자 이상 입력해 주세요.";
    }

    return "";
  };

  const validators = {
    myName: (value) => {
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        return "이름을 입력해 주세요.";
      }
      if (normalizedValue.length < 2) {
        return "이름은 2자 이상 입력해 주세요.";
      }
      return "";
    },
    myPhone: (value) => {
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        return "휴대폰 번호를 입력해 주세요.";
      }
      const digits = normalizedValue.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) {
        return "휴대폰 번호 10~11자리를 정확히 입력해 주세요.";
      }
      return "";
    },
    myEmail: (value) => {
      const normalizedValue = value.trim();
      if (!normalizedValue) {
        return "이메일을 입력해 주세요.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
        return "올바른 이메일 형식으로 입력해 주세요.";
      }
      return "";
    },
    myPassword: (value) => evaluatePassword(value),
    myPasswordConfirm: (value) => {
      if (!value) {
        return "패스워드 확인을 입력해 주세요.";
      }
      if (value !== fields.myPassword.value) {
        return "패스워드가 일치하지 않습니다.";
      }
      return "";
    },
  };

  const touchedState = {
    myName: false,
    myPhone: false,
    myEmail: false,
    myPassword: false,
    myPasswordConfirm: false,
  };

  const applyValidationState = (fieldId, message) => {
    const input = fields[fieldId];
    const messageElement = messageMap[fieldId];
    if (!input || !messageElement) {
      return;
    }

    const hasValue = input.value.trim().length > 0;
    const isInvalid = touchedState[fieldId] && Boolean(message);
    const isValid = touchedState[fieldId] && hasValue && !message;

    input.classList.toggle("is-invalid", isInvalid);
    input.classList.toggle("is-valid", isValid);

    if (isInvalid) {
      messageElement.textContent = message;
      messageElement.classList.add("is-visible");
    } else {
      messageElement.textContent = "";
      messageElement.classList.remove("is-visible");
    }
  };

  const validateField = (fieldId) => {
    const input = fields[fieldId];
    const validator = validators[fieldId];

    if (!input || !validator) {
      return true;
    }

    const message = validator(input.value);
    applyValidationState(fieldId, message);
    return !message;
  };

  Object.keys(fields).forEach((fieldId) => {
    const input = fields[fieldId];
    if (!input) {
      return;
    }

    input.addEventListener("blur", () => {
      touchedState[fieldId] = true;
      validateField(fieldId);

      if (fieldId === "myPassword") {
        touchedState.myPasswordConfirm = touchedState.myPasswordConfirm || fields.myPasswordConfirm.value.length > 0;
        validateField("myPasswordConfirm");
      }
    });

    input.addEventListener("input", () => {
      if (touchedState[fieldId]) {
        validateField(fieldId);
      }

      if (fieldId === "myPassword" && touchedState.myPasswordConfirm) {
        validateField("myPasswordConfirm");
      }
    });
  });

  submitButton.addEventListener("click", () => {
    Object.keys(touchedState).forEach((fieldId) => {
      touchedState[fieldId] = true;
    });

    const allFieldsValid = Object.keys(fields).every((fieldId) => validateField(fieldId));

    if (!allFieldsValid) {
      return;
    }

    applySignedInState(fields.myName.value);
  });
}

function setupFocusedFieldScroll() {
  const sheetBody = document.querySelector(".my-sheet-body");
  const fieldInputs = document.querySelectorAll(".my-field-input");

  if (!sheetBody || fieldInputs.length === 0) {
    return;
  }

  const scrollFieldIntoPosition = (input) => {
    if (!input || !input.id) {
      return;
    }

    const fieldLabel = sheetBody.querySelector(`.my-field-label[for="${input.id}"]`);
    if (!fieldLabel) {
      return;
    }

    const sheetBodyRect = sheetBody.getBoundingClientRect();
    const labelRect = fieldLabel.getBoundingClientRect();
    const topGap = 10;
    const currentScrollTop = sheetBody.scrollTop;
    const labelTopInSheet = labelRect.top - sheetBodyRect.top + currentScrollTop;
    const targetScrollTop = Math.max(0, labelTopInSheet - topGap);

    sheetBody.scrollTo({
      top: targetScrollTop,
      behavior: "smooth",
    });
  };

  fieldInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      runAfterNextPaint(() => {
        scrollFieldIntoPosition(input);
        setTimeout(() => {
          scrollFieldIntoPosition(input);
        }, 180);
      });
    });
  });
}

function setupButtonRippleEffects() {
  const rippleButtons = document.querySelectorAll(
    ".my-btn-primary, .my-btn-secondary, .my-sheet-social, .my-create-account-btn"
  );

  if (rippleButtons.length === 0) {
    return;
  }

  rippleButtons.forEach((button) => {
    const isDarkButton = button.classList.contains("my-btn-primary") || button.classList.contains("my-create-account-btn");
    button.classList.add("ripple-button");
    button.classList.add(isDarkButton ? "ripple-dark" : "ripple-light");

    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const maxX = Math.max(x, rect.width - x);
      const maxY = Math.max(y, rect.height - y);
      const rippleSize = Math.hypot(maxX, maxY) * 2;

      const ripple = document.createElement("span");
      ripple.className = "button-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;

      button.appendChild(ripple);
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });
}

updateScale();
runEntryAnimation();
setupBottomSheet();
setupPasswordVisibilityToggles();
setupPasswordConditionChecklist();
setupFieldValidations();
setupFocusedFieldScroll();
setupButtonRippleEffects();
setupToastCloseButton();
window.addEventListener("resize", updateScale);
window.addEventListener("orientationchange", updateScale);
