[//]: # (title: 코드 스니펫 실행)

Kotlin 코드는 일반적으로 IDE, 텍스트 편집기 또는 다른 도구에서 작업하는 프로젝트로 구성됩니다. 그러나 함수의 작동 방식을 빠르게 확인하거나 표현식의 값을 찾고 싶을 때 새 프로젝트를 만들고 빌드할 필요는 없습니다. 다음은 다양한 환경에서 Kotlin 코드를 즉시 실행할 수 있는 세 가지 유용한 방법입니다:

* IDE의 [스크래치 파일 및 워크시트](#ide-scratches-and-worksheets).
* 브라우저의 [Kotlin 플레이그라운드](#browser-kotlin-playground).
* 명령줄의 [ki shell](#command-line-ki-shell).

## IDE: 스크래치 및 워크시트

IntelliJ IDEA와 Android Studio는 Kotlin [스크래치 파일 및 워크시트](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)를 지원합니다.

* _스크래치 파일_ (또는 간단히 _스크래치_)을 사용하면 프로젝트와 동일한 IDE 창에서 코드 초안을 만들고 즉석에서 실행할 수 있습니다.
  스크래치는 프로젝트에 연결되지 않으며 OS의 모든 IntelliJ IDEA 창에서 모든 스크래치에 액세스하고 실행할 수 있습니다.

  Kotlin 스크래치를 만들려면 **파일** | **새로 만들기** | **스크래치 파일**을 클릭하고 **Kotlin** 타입을 선택합니다.

* _워크시트_는 프로젝트 파일입니다. 프로젝트 디렉토리에 저장되며 프로젝트 모듈에 연결됩니다.
  워크시트는 실제로 소프트웨어 단위를 구성하지는 않지만 교육 자료나 데모 자료와 같이 프로젝트 내에 함께 저장되어야 하는 코드 조각을 작성하는 데 유용합니다.

  프로젝트 디렉토리에서 Kotlin 워크시트를 만들려면 프로젝트 트리에서 디렉토리를 마우스 오른쪽 버튼으로 클릭하고
  **새로 만들기** | **Kotlin 클래스/파일** | **Kotlin 워크시트**를 선택합니다.

    > Kotlin 워크시트는 [K2 모드](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)에서 지원되지 않습니다. 유사한 기능을 제공하는 대안을 마련하기 위해 노력하고 있습니다.
    >
    {style="warning"}

구문 강조, 자동 완성 및 기타
IntelliJ IDEA 코드 편집 기능은 스크래치 및 워크시트에서 지원됩니다. `main()` 함수를 선언할 필요가 없습니다.
작성하는 모든 코드는 `main()` 본문에 있는 것처럼 실행됩니다.

스크래치나 워크시트에서 코드 작성을 마치면 **실행**을 클릭합니다.
실행 결과는 코드 반대편 줄에 나타납니다.

![스크래치 실행](scratch-run.png){width=700}

### 인터랙티브 모드

IDE는 스크래치 및 워크시트의 코드를 자동으로 실행할 수 있습니다. 입력을 멈추는 즉시 실행 결과를 얻으려면
**인터랙티브 모드**를 켜십시오.

![스크래치 인터랙티브 모드](scratch-interactive.png){width=700}

### 모듈 사용

Kotlin 프로젝트의 클래스나 함수를 스크래치 및 워크시트에서 사용할 수 있습니다.

워크시트는 상주하는 모듈의 클래스 및 함수에 자동으로 액세스할 수 있습니다.

프로젝트의 클래스나 함수를 스크래치에서 사용하려면 평소처럼 `import` 문을 사용하여 스크래치 파일로 가져옵니다. 그런 다음 코드를 작성하고 **모듈의 클래스패스 사용** 목록에서 적절한 모듈을 선택하여 실행합니다.

스크래치와 워크시트 모두 연결된 모듈의 컴파일된 버전을 사용합니다. 따라서 모듈의 소스 파일을 수정하면 모듈을 다시 빌드할 때 변경 사항이 스크래치와 워크시트에 전파됩니다.
스크래치나 워크시트를 실행하기 전에 모듈을 자동으로 다시 빌드하려면 **실행 전 모듈 빌드**를 선택합니다.

![스크래치 모듈 선택](scratch-select-module.png){width=700}

### REPL로 실행

스크래치 또는 워크시트에서 각 특정 표현식을 평가하려면 **REPL 사용**을 선택하여 실행합니다. 코드 줄은 순차적으로 실행되어 각 호출의 결과를 제공합니다.
나중에 동일한 파일에서 해당 줄에 표시되는 자동 생성된 `res*` 이름을 참조하여 결과를 사용할 수 있습니다.

![스크래치 REPL](scratch-repl.png){width=700}

## 브라우저: Kotlin 플레이그라운드

[Kotlin 플레이그라운드](https://play.kotlinlang.org/)는 브라우저에서 Kotlin 코드를 작성, 실행 및 공유할 수 있는 온라인 애플리케이션입니다.

### 코드 작성 및 편집

플레이그라운드의 편집기 영역에서는 소스 파일에서와 마찬가지로 코드를 작성할 수 있습니다:
* 임의의 순서로 자신만의 클래스, 함수 및 최상위 선언을 추가합니다.
* 실행 가능한 부분은 `main()` 함수의 본문에 작성합니다.

일반적인 Kotlin 프로젝트에서와 마찬가지로 플레이그라운드의 `main()` 함수는 `args` 파라미터를 갖거나 전혀 갖지 않을 수 있습니다.
실행 시 프로그램 인수를 전달하려면 **프로그램 인수** 필드에 작성합니다.

![플레이그라운드: 코드 완성](playground-completion.png){width=700}

플레이그라운드는 코드를 강조 표시하고 입력할 때 코드 완성 옵션을 보여줍니다. 표준 라이브러리 및 [`kotlinx.coroutines`](coroutines-overview.md)에서 선언을 자동으로 가져옵니다.

### 실행 환경 선택

플레이그라운드는 실행 환경을 사용자 정의할 수 있는 방법을 제공합니다:
* 사용 가능한 [향후 버전 미리보기](eap.md)를 포함한 여러 Kotlin 버전.
* 코드를 실행할 여러 백엔드: JVM, JS (레거시 또는 [IR 컴파일러](js-ir-compiler.md), 또는 Canvas), 또는 JUnit.

![플레이그라운드: 환경 설정](playground-env-setup.png){width=700}

JS 백엔드의 경우 생성된 JS 코드도 볼 수 있습니다.

![플레이그라운드: 생성된 JS](playground-generated-js.png){width=700}

### 온라인 코드 공유

플레이그라운드를 사용하여 다른 사람들과 코드를 공유하십시오 – **링크 복사**를 클릭하고 코드를 보여주고 싶은 사람에게 보내십시오.

플레이그라운드의 코드 조각을 다른 웹사이트에 포함시키고 실행 가능하게 만들 수도 있습니다. **코드 공유**를 클릭하여 샘플을 웹 페이지나 [Medium](https://medium.com/) 기사에 포함시키십시오.

![플레이그라운드: 코드 공유](playground-share.png){width=700}

## 명령줄: ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_)은 터미널에서 Kotlin 코드를 실행하기 위한 명령줄
유틸리티입니다. Linux, macOS 및 Windows에서 사용할 수 있습니다.

ki shell은 기본적인 코드 평가 기능과 함께 다음과 같은 고급 기능을 제공합니다:
* 코드 완성
* 타입 검사
* 외부 종속성
* 코드 조각 붙여넣기 모드
* 스크립팅 지원

자세한 내용은 [ki shell GitHub 저장소](https://github.com/Kotlin/kotlin-interactive-shell)를 참조하십시오.

### ki shell 설치 및 실행

ki shell을 설치하려면 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell)에서 최신 버전을 다운로드하여
원하는 디렉토리에 압축을 풉니다.

macOS에서는 다음 명령을 실행하여 Homebrew로 ki shell을 설치할 수도 있습니다:

```shell
brew install ki
```

ki shell을 시작하려면 Linux 및 macOS에서는 `bin/ki.sh`를 실행하거나(Homebrew로 ki shell을 설치한 경우 그냥 `ki`),
Windows에서는 `bin\ki.bat`를 실행합니다.

셸이 실행되면 터미널에서 즉시 Kotlin 코드 작성을 시작할 수 있습니다. ki shell에서 사용할 수 있는 명령을 보려면 `:help`(또는 `:h`)를 입력하십시오.

### 코드 완성 및 강조

ki shell은 **Tab** 키를 누르면 코드 완성 옵션을 보여줍니다. 또한 입력할 때 구문 강조 기능도 제공합니다.
이 기능은 `:syntax off`를 입력하여 비활성화할 수 있습니다.

![ki shell 강조 및 완성](ki-shell-highlight-completion.png){width=700}

**Enter** 키를 누르면 ki shell은 입력된 줄을 평가하고 결과를 출력합니다. 표현식 값은
`res*`와 같이 자동 생성된 이름을 가진 변수로 출력됩니다. 나중에 실행하는 코드에서 이러한 변수를 사용할 수 있습니다.
입력된 구문이 불완전한 경우(예: 조건은 있지만 본문이 없는 `if`), 셸은
세 개의 점을 출력하고 나머지 부분을 기다립니다.

![ki shell 결과](ki-shell-results.png){width=700}

### 표현식 타입 확인

잘 모르는 복잡한 표현식이나 API의 경우, ki shell은 표현식의 타입을 보여주는 `:type`(또는 `:t`) 명령을 제공합니다:

![ki shell 타입](ki-shell-type.png){width=700}

### 코드 로드

필요한 코드가 다른 곳에 저장되어 있는 경우, ki shell에서 코드를 로드하여 사용하는 두 가지 방법이 있습니다:
* `:load`(또는 `:l`) 명령으로 소스 파일을 로드합니다.
* `:paste`(또는 `:p`) 명령으로 붙여넣기 모드에서 코드 조각을 복사하여 붙여넣습니다.

![ki shell 파일 로드](ki-shell-load.png){width=700}

`ls` 명령은 사용 가능한 심볼(변수 및 함수)을 보여줍니다.

### 외부 종속성 추가

표준 라이브러리와 함께 ki shell은 외부 종속성도 지원합니다.
이를 통해 전체 프로젝트를 만들지 않고도 타사 라이브러리를 사용해 볼 수 있습니다.

ki shell에 타사 라이브러리를 추가하려면 `:dependsOn` 명령을 사용합니다. 기본적으로 ki shell은 Maven Central과 함께 작동하지만,
`:repository` 명령을 사용하여 다른 저장소를 연결할 수 있습니다:

![ki shell 외부 종속성](ki-shell-dependency.png){width=700}