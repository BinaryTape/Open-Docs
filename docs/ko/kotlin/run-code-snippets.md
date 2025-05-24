---
title: "코드 스니펫 실행"
---
Kotlin 코드는 일반적으로 IDE, 텍스트 편집기 또는 기타 도구에서 작업하는 프로젝트로 구성됩니다. 하지만 함수 작동 방식을 빠르게 확인하거나 표현식 값을 찾고 싶을 때 새 프로젝트를 만들고 빌드할 필요가 없습니다. 다양한 환경에서 Kotlin 코드를 즉시 실행할 수 있는 다음 세 가지 편리한 방법을 확인해 보세요.

* IDE의 [스크래치 파일 및 워크시트](#ide-scratches-and-worksheets).
* 브라우저의 [Kotlin Playground](#browser-kotlin-playground).
* 명령줄의 [ki shell](#command-line-ki-shell).

## IDE: 스크래치 및 워크시트

IntelliJ IDEA 및 Android Studio는 Kotlin [스크래치 파일 및 워크시트](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32)를 지원합니다.

* _스크래치 파일_ (또는 그냥 _스크래치_)을 사용하면 프로젝트와 동일한 IDE 창에서 코드 초안을 만들고 즉석에서 실행할 수 있습니다.
  스크래치는 프로젝트에 연결되지 않습니다. OS의 모든 IntelliJ IDEA 창에서 모든 스크래치에 액세스하고 실행할 수 있습니다.

  Kotlin 스크래치를 만들려면 **File** | **New** | **Scratch File**을 클릭하고 **Kotlin** 유형을 선택합니다.

* _워크시트_는 프로젝트 파일입니다. 프로젝트 디렉터리에 저장되고 프로젝트 모듈에 연결됩니다.
  워크시트는 실제로 소프트웨어 단위를 만들지는 않지만 교육 또는 데모 자료와 같이 프로젝트에 함께 저장해야 하는 코드 조각을 작성하는 데 유용합니다.

  프로젝트 디렉터리에서 Kotlin 워크시트를 만들려면 프로젝트 트리에서 디렉터리를 마우스 오른쪽 버튼으로 클릭하고
  **New** | **Kotlin Class/File** | **Kotlin Worksheet**를 선택합니다.

    > Kotlin 워크시트는 [K2 모드](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)에서 지원되지 않습니다. 유사한 기능을 제공하는 대안을 개발 중입니다.
    >
    

구문 강조 표시, 자동 완성 및 기타
IntelliJ IDEA 코드 편집 기능은 스크래치 및 워크시트에서 지원됩니다. `main()` 함수를 선언할 필요가 없습니다. 작성하는 모든 코드는 `main()` 본문에 있는 것처럼 실행됩니다.

스크래치 또는 워크시트에서 코드 작성을 완료했으면 **Run**을 클릭합니다.
실행 결과는 코드 반대편 줄에 나타납니다.

<img src="/img/scratch-run.png" alt="Run scratch" width="700" style={{verticalAlign: 'middle'}}/>

### 대화형 모드

IDE는 스크래치 및 워크시트에서 코드를 자동으로 실행할 수 있습니다. 입력을 중지하는 즉시 실행 결과를 얻으려면 **Interactive mode**를 켭니다.

<img src="/img/scratch-interactive.png" alt="Scratch interactive mode" width="700" style={{verticalAlign: 'middle'}}/>

### 모듈 사용

스크래치 및 워크시트에서 Kotlin 프로젝트의 클래스 또는 함수를 사용할 수 있습니다.

워크시트는 해당 워크시트가 있는 모듈의 클래스 및 함수에 자동으로 액세스할 수 있습니다.

스크래치에서 프로젝트의 클래스 또는 함수를 사용하려면 `import` 문을 사용하여 스크래치 파일로 가져옵니다. 그런 다음 코드를 작성하고 **Use classpath of module** 목록에서 적절한 모듈을 선택하여 실행합니다.

스크래치와 워크시트 모두 연결된 모듈의 컴파일된 버전을 사용합니다. 따라서 모듈의 소스 파일을 수정하면 모듈을 다시 빌드할 때 변경 내용이 스크래치 및 워크시트로 전파됩니다.
스크래치 또는 워크시트를 실행할 때마다 모듈을 자동으로 다시 빌드하려면 **Make module before Run**을 선택합니다.

<img src="/img/scratch-select-module.png" alt="Scratch select module" width="700" style={{verticalAlign: 'middle'}}/>

### REPL로 실행

스크래치 또는 워크시트에서 특정 표현식을 평가하려면 **Use REPL**을 선택하여 실행합니다. 코드 줄은 순차적으로 실행되어 각 호출 결과를 제공합니다.
자동 생성된 `res*` 이름(해당 줄에 표시됨)을 참조하여 나중에 동일한 파일에서 결과를 사용할 수 있습니다.

<img src="/img/scratch-repl.png" alt="Scratch REPL" width="700" style={{verticalAlign: 'middle'}}/>

## 브라우저: Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/)는 브라우저에서 Kotlin 코드를 작성, 실행 및 공유하기 위한 온라인 애플리케이션입니다.

### 코드 작성 및 편집

Playground의 편집기 영역에서 소스 파일에서와 마찬가지로 코드를 작성할 수 있습니다.
* 임의 순서로 사용자 지정 클래스, 함수 및 최상위 선언을 추가합니다.
* `main()` 함수의 본문에 실행 가능한 부분을 작성합니다.

일반적인 Kotlin 프로젝트와 마찬가지로 Playground의 `main()` 함수는 `args` 매개변수를 가질 수도 있고 매개변수가 전혀 없을 수도 있습니다.
실행 시 프로그램 인수를 전달하려면 **Program arguments** 필드에 작성합니다.

<img src="/img/playground-completion.png" alt="Playground: code completion" width="700" style={{verticalAlign: 'middle'}}/>

Playground는 코드를 강조 표시하고 입력할 때 코드 완성 옵션을 표시합니다. 표준 라이브러리 및 [`kotlinx.coroutines`](coroutines-overview)에서 선언을 자동으로 가져옵니다.

### 실행 환경 선택

Playground는 실행 환경을 사용자 지정하는 방법을 제공합니다.
* 사용 가능한 [향후 버전 미리 보기](eap)를 포함한 여러 Kotlin 버전.
* JVM, JS(레거시 또는 [IR 컴파일러](js-ir-compiler) 또는 Canvas), JUnit 등 코드를 실행할 수 있는 여러 백엔드.

<img src="/img/playground-env-setup.png" alt="Playground: environment setup" width="700" style={{verticalAlign: 'middle'}}/>

JS 백엔드의 경우 생성된 JS 코드를 볼 수도 있습니다.

<img src="/img/playground-generated-js.png" alt="Playground: generated JS" width="700" style={{verticalAlign: 'middle'}}/>

### 온라인으로 코드 공유

Playground를 사용하여 다른 사람과 코드를 공유합니다. **Copy link**를 클릭하고 코드를 표시하려는 모든 사람에게 보냅니다.

Playground의 코드 스니펫을 다른 웹사이트에 포함하고 실행 가능하게 만들 수도 있습니다. **Share code**를 클릭하여 샘플을 모든 웹 페이지 또는 [Medium](https://medium.com/) 기사에 포함합니다.

<img src="/img/playground-share.png" alt="Playground: share code" width="700" style={{verticalAlign: 'middle'}}/>

## 명령줄: ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_)은 명령줄에서 Kotlin 코드를 실행하기 위한 명령줄
유틸리티입니다. Linux, macOS 및 Windows에서 사용할 수 있습니다.

ki shell은 기본 코드 평가 기능과 함께 다음과 같은 고급 기능을 제공합니다.
* 코드 완성
* 유형 검사
* 외부 종속성
* 코드 스니펫용 붙여넣기 모드
* 스크립팅 지원

자세한 내용은 [ki shell GitHub 리포지토리](https://github.com/Kotlin/kotlin-interactive-shell)를 참조하세요.

### ki shell 설치 및 실행

ki shell을 설치하려면 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell)에서 최신 버전을 다운로드하고
원하는 디렉터리에 압축을 풉니다.

macOS에서는 다음 명령을 실행하여 Homebrew로 ki shell을 설치할 수도 있습니다.

```shell
brew install ki
```

ki shell을 시작하려면 Linux 및 macOS에서 `bin/ki.sh`를 실행하고(또는 Homebrew로 ki shell을 설치한 경우 `ki`만 실행)
Windows에서는 `bin\ki.bat`를 실행합니다.

셸이 실행되면 터미널에서 즉시 Kotlin 코드 작성을 시작할 수 있습니다. `:help`(또는 `:h`)를 입력하여 ki shell에서 사용할 수 있는
명령을 확인합니다.

### 코드 완성 및 강조 표시

ki shell은 **Tab**을 누르면 코드 완성 옵션을 표시합니다. 또한 입력할 때 구문 강조 표시를 제공합니다.
`:syntax off`를 입력하여 이 기능을 비활성화할 수 있습니다.

<img src="/img/ki-shell-highlight-completion.png" alt="ki shell highlighting and completion" width="700" style={{verticalAlign: 'middle'}}/>

**Enter**를 누르면 ki shell은 입력된 줄을 평가하고 결과를 출력합니다. 표현식 값은
`res*`와 같은 자동 생성된 이름의 변수로 출력됩니다. 나중에 실행하는 코드에서 이러한 변수를 사용할 수 있습니다.
입력된 구성이 불완전한 경우(예: 조건은 있지만 본문이 없는 `if`) 셸은
세 개의 점을 출력하고 나머지 부분을 기다립니다.

<img src="/img/ki-shell-results.png" alt="ki shell results" width="700" style={{verticalAlign: 'middle'}}/>

### 표현식 유형 확인

잘 모르는 복잡한 표현식 또는 API의 경우 ki shell은 표현식 유형을 표시하는 `:type`(또는 `:t`) 명령을 제공합니다.

<img src="/img/ki-shell-type.png" alt="ki shell type" width="700" style={{verticalAlign: 'middle'}}/>

### 코드 로드

필요한 코드가 다른 곳에 저장되어 있는 경우 ki shell에서 코드를 로드하고 사용하는 두 가지 방법이 있습니다.
* `:load`(또는 `:l`) 명령으로 소스 파일을 로드합니다.
* `:paste`(또는 `:p`) 명령으로 붙여넣기 모드에서 코드 스니펫을 복사하여 붙여넣습니다.

<img src="/img/ki-shell-load.png" alt="ki shell load file" width="700" style={{verticalAlign: 'middle'}}/>

`ls` 명령은 사용 가능한 기호(변수 및 함수)를 표시합니다.

### 외부 종속성 추가

ki shell은 표준 라이브러리와 함께 외부 종속성도 지원합니다.
이를 통해 전체 프로젝트를 만들지 않고도 타사 라이브러리를 사용해 볼 수 있습니다.

ki shell에 타사 라이브러리를 추가하려면 `:dependsOn` 명령을 사용합니다. 기본적으로 ki shell은 Maven Central과 함께 작동하지만
`:repository` 명령을 사용하여 연결하면 다른 리포지토리를 사용할 수 있습니다.

<img src="/img/ki-shell-dependency.png" alt="ki shell external dependency" width="700" style={{verticalAlign: 'middle'}}/>