---
title: "Kotlin 명령줄 컴파일러"
---
Kotlin의 각 릴리스는 독립 실행형 컴파일러 버전과 함께 제공됩니다. 최신 버전은 수동으로 다운로드하거나 패키지 관리자를 통해 다운로드할 수 있습니다.

:::note
명령줄 컴파일러를 설치하는 것은 Kotlin을 사용하는 데 필수적인 단계는 아닙니다.
일반적인 방법은 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 또는 [Android Studio](https://developer.android.com/studio)와 같이 공식적인 Kotlin 지원이 있는 IDE 또는 코드 편집기를 사용하여 Kotlin 애플리케이션을 작성하는 것입니다.
이러한 도구는 Kotlin을 완벽하게 지원합니다.

[IDE에서 Kotlin 시작하기](getting-started) 방법을 알아보세요.

:::

## 컴파일러 설치

### 수동 설치

Kotlin 컴파일러를 수동으로 설치하려면:

1. [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20)에서 최신 버전(`kotlin-compiler-2.1.20.zip`)을 다운로드합니다.
2. 독립 실행형 컴파일러를 디렉터리에 압축 해제하고 선택적으로 `bin` 디렉터리를 시스템 경로에 추가합니다.
`bin` 디렉터리에는 Windows, macOS 및 Linux에서 Kotlin을 컴파일하고 실행하는 데 필요한 스크립트가 포함되어 있습니다.

:::note
Windows에서 Kotlin 명령줄 컴파일러를 사용하려면 수동으로 설치하는 것이 좋습니다.

:::

### SDKMAN!

macOS, Linux, Cygwin, FreeBSD 및 Solaris와 같은 UNIX 기반 시스템에 Kotlin을 설치하는 더 쉬운 방법은
[SDKMAN!](https://sdkman.io)입니다. Bash 및 ZSH 셸에서도 작동합니다. [SDKMAN! 설치 방법](https://sdkman.io/install)을 알아보세요.

SDKMAN!을 통해 Kotlin 컴파일러를 설치하려면 터미널에서 다음 명령을 실행합니다.

```bash
sdk install kotlin
```

### Homebrew

또는 macOS에서 [Homebrew](https://brew.sh/)를 통해 컴파일러를 설치할 수 있습니다.

```bash
brew update
brew install kotlin
```

### Snap 패키지

Ubuntu 16.04 이상에서 [Snap](https://snapcraft.io/)을 사용하는 경우 명령줄에서 컴파일러를 설치할 수 있습니다.

```bash
sudo snap install --classic kotlin
```

## 애플리케이션 생성 및 실행

1. `"Hello, World!"`를 표시하는 간단한 콘솔 JVM 애플리케이션을 Kotlin으로 만듭니다.
   코드 편집기에서 다음 코드를 사용하여 `hello.kt`라는 새 파일을 만듭니다.

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. Kotlin 컴파일러를 사용하여 애플리케이션을 컴파일합니다.

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` 옵션은 생성된 클래스 파일의 출력 경로를 나타냅니다. 이 경로는 디렉터리 또는 **.jar** 파일일 수 있습니다.
   * `-include-runtime` 옵션은 결과 **.jar** 파일이 Kotlin 런타임
라이브러리를 포함하여 독립 실행형으로 실행 가능하도록 만듭니다.

   사용 가능한 모든 옵션을 보려면 다음을 실행합니다.

   ```bash
   kotlinc -help
   ```

3. 애플리케이션을 실행합니다.

   ```bash
   java -jar hello.jar
   ```

## 라이브러리 컴파일

다른 Kotlin 애플리케이션에서 사용할 라이브러리를 개발하는 경우 Kotlin 런타임을 포함하지 않고 **.jar** 파일을 빌드할 수 있습니다.

```bash
kotlinc hello.kt -d hello.jar
```

이러한 방식으로 컴파일된 바이너리는 Kotlin 런타임에 종속되므로,
컴파일된 라이브러리가 사용될 때마다 런타임이 클래스 경로에 있는지 확인해야 합니다.

`kotlin` 스크립트를 사용하여 Kotlin 컴파일러에서 생성된 바이너리를 실행할 수도 있습니다.

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt`는 Kotlin 컴파일러가 `hello.kt`라는 파일에 대해 생성하는 기본 클래스 이름입니다.

## REPL 실행

매개변수 없이 컴파일러를 실행하여 대화형 셸을 사용할 수 있습니다. 이 셸에서 유효한 Kotlin 코드를 입력하고
결과를 볼 수 있습니다.

<img src="/img/kotlin-shell.png" alt="Shell" width="500"/>

## 스크립트 실행

Kotlin을 스크립팅 언어로 사용할 수 있습니다.
Kotlin 스크립트는 최상위 실행 코드가 있는 Kotlin 소스 파일(`.kts`)입니다.

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file `->` file.isDirectory() }
folders?.forEach { folder `->` println(folder) }
```

스크립트를 실행하려면 해당 스크립트 파일과 함께 컴파일러에 `-script` 옵션을 전달합니다.

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin은 외부 속성 추가,
정적 또는 동적 종속성 제공 등과 같은 스크립트 사용자 정의에 대한 실험적 지원을 제공합니다.
사용자 정의는 적절한 지원 코드가 있는 주석 처리된 Kotlin 클래스인 소위 _스크립트 정의_에 의해 정의됩니다.
스크립트 파일 이름 확장자는 적절한 정의를 선택하는 데 사용됩니다.
[Kotlin 사용자 지정 스크립팅](custom-script-deps-tutorial)에 대해 자세히 알아보세요.

적절하게 준비된 스크립트 정의는 해당 jars가 컴파일 클래스 경로에 포함될 때 자동으로 감지되어 적용됩니다.
또는 컴파일러에 `-script-templates` 옵션을 전달하여 정의를 수동으로 지정할 수 있습니다.

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

자세한 내용은 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)를 참조하세요.