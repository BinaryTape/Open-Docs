---
title: "Kotlin/Native 시작하기"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

이 튜토리얼에서는 Kotlin/Native 애플리케이션을 만드는 방법을 배웁니다. 자신에게 가장 적합한 도구를 선택하고 다음 방법으로 앱을 만드세요.

* **[IDE에서](#in-ide)**. 여기서는 버전 관리 시스템에서 프로젝트 템플릿을 복제하여 IntelliJ IDEA에서 사용할 수 있습니다.
* **[Gradle 빌드 시스템 사용](#using-gradle)**. 내부 작동 방식을 더 잘 이해하려면 프로젝트의 빌드 파일을 수동으로 만드세요.
* **[명령줄 도구 사용](#using-the-command-line-compiler)**. 표준 Kotlin 배포판의 일부로 제공되는 Kotlin/Native 컴파일러를 사용하여 명령줄 도구에서 직접 앱을 만들 수 있습니다.

  콘솔 컴파일은 간단하고 직관적일 수 있지만 파일과 라이브러리가 수백 개에 달하는 대규모 프로젝트에는 적합하지 않습니다. 이러한 프로젝트에는 IDE 또는 빌드 시스템을 사용하는 것이 좋습니다.

Kotlin/Native를 사용하면 Linux, macOS, Windows를 포함한 [다양한 대상](native-target-support)에 대해 컴파일할 수 있습니다. 크로스 플랫폼 컴파일이 가능하지만(즉, 하나의 플랫폼을 사용하여 다른 플랫폼용으로 컴파일), 이 튜토리얼에서는 컴파일하는 플랫폼과 동일한 플랫폼을 대상으로 합니다.

:::note
Mac을 사용하고 macOS 또는 다른 Apple 대상용 애플리케이션을 만들고 실행하려면 먼저 [Xcode Command Line Tools](https://developer.apple.com/download/)를 설치하고 실행한 다음 라이선스 약관에 동의해야 합니다.

:::

## IDE에서

이 섹션에서는 IntelliJ IDEA를 사용하여 Kotlin/Native 애플리케이션을 만드는 방법을 배웁니다. Community Edition과 Ultimate Edition을 모두 사용할 수 있습니다.

### 프로젝트 생성

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/)를 다운로드하여 설치합니다.
2. IntelliJ IDEA에서 **File** | **New** | **Project from Version Control**을 선택하고 다음 URL을 사용하여 [프로젝트 템플릿](https://github.com/Kotlin/kmp-native-wizard)을 복제합니다.

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```   

3. `gradle/libs.versions.toml` 파일을 엽니다. 이 파일은 프로젝트 종속성의 버전 카탈로그입니다. Kotlin/Native 애플리케이션을 만들려면 Kotlin과 동일한 버전의 Kotlin Multiplatform Gradle 플러그인이 필요합니다. 최신 Kotlin 버전을 사용하고 있는지 확인하세요.

   ```none
   [versions]
   kotlin = "2.1.20"
   ```

4. Gradle 파일을 다시 로드하라는 메시지에 따릅니다.

   <img src="/img/load-gradle-changes.png" alt="Gradle 변경 사항 로드 버튼" width="295" style={{verticalAlign: 'middle'}}/>

이러한 설정에 대한 자세한 내용은 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference)를 참조하세요.

### 애플리케이션 빌드 및 실행

`src/nativeMain/kotlin/` 디렉터리에서 `Main.kt` 파일을 엽니다.

* `src` 디렉터리에는 Kotlin 소스 파일이 있습니다.
* `Main.kt` 파일에는 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 함수를 사용하여 "Hello, Kotlin/Native!"를 출력하는 코드가 포함되어 있습니다.

코드 줄 옆의 녹색 아이콘을 눌러 코드를 실행합니다.

<img src="/img/native-run-gutter.png" alt="애플리케이션 실행" width="478" style={{verticalAlign: 'middle'}}/>

IntelliJ IDEA는 Gradle 작업을 사용하여 코드를 실행하고 **Run** 탭에 결과를 출력합니다.

<img src="/img/native-output-gutter-1.png" alt="애플리케이션 출력" width="331" style={{verticalAlign: 'middle'}}/>

처음 실행한 후 IDE는 상단에 해당 실행 구성을 만듭니다.

<img src="/img/native-run-config.png" alt="Gradle 실행 구성" width="503" style={{verticalAlign: 'middle'}}/>
:::note
IntelliJ IDEA Ultimate 사용자는 컴파일된 네이티브 실행 파일을 디버깅하고 가져온 Kotlin/Native 프로젝트에 대한 실행 구성을 자동으로 생성할 수 있는 [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) 플러그인을 설치할 수 있습니다.

[IntelliJ IDEA를 구성](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build)하여 프로젝트를 자동으로 빌드할 수 있습니다.

1. **Settings | Build, Execution, Deployment | Compiler**로 이동합니다.
2. **Compiler** 페이지에서 **Build project automatically**를 선택합니다.
3. 변경 사항을 적용합니다.

이제 클래스 파일을 변경하거나 파일을 저장(<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>)하면 IntelliJ IDEA가 프로젝트의 증분 빌드를 자동으로 수행합니다.

### 애플리케이션 업데이트

이름에 있는 글자 수를 세는 기능을 애플리케이션에 추가해 보겠습니다.

1. `Main.kt` 파일에서 입력을 읽는 코드를 추가합니다. [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 함수를 사용하여 입력 값을 읽고 `name` 변수에 할당합니다.

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. Gradle을 사용하여 이 앱을 실행하려면 `build.gradle.kts` 파일에서 `System.in`을 입력으로 지정하고 Gradle 변경 사항을 로드합니다.

   ```kotlin
   kotlin {
       //...
       nativeTarget.apply {
           binaries {
               executable {
                   entryPoint = "main"
                   runTask?.standardInput = System.`in`
               }
           }
       }
       //...
   }
   ```
   

3. 공백을 제거하고 글자 수를 세세요.

   * [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 함수를 사용하여 이름에서 빈 공간을 제거합니다.
   * 범위 함수 [`let`](scope-functions#let)을 사용하여 객체 컨텍스트 내에서 함수를 실행합니다.
   * 달러 기호 `$`를 추가하고 중괄호 `${it.length}`로 묶어 문자열 템플릿에 이름 길이를 삽입합니다. `it`은 [람다 매개변수](coding-conventions#lambda-parameters)의 기본 이름입니다.

   ```kotlin
   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 애플리케이션을 실행합니다.
5. 이름을 입력하고 결과를 확인합니다.

   <img src="/img/native-output-gutter-2.png" alt="애플리케이션 출력" width="422" style={{verticalAlign: 'middle'}}/>

이제 이름에서 고유한 글자만 세어 보겠습니다.

1. `Main.kt` 파일에서 `String`에 대한 새 [확장 함수](extensions#extension-functions) `.countDistinctCharacters()`를 선언합니다.

   * [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 함수를 사용하여 이름을 소문자로 변환합니다.
   * [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 함수를 사용하여 입력 문자열을 문자 목록으로 변환합니다.
   * [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 함수를 사용하여 이름에서 고유한 문자만 선택합니다.
   * [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용하여 고유한 문자 수를 셉니다.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. `.countDistinctCharacters()` 함수를 사용하여 이름에서 고유한 글자 수를 셉니다.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // Read the input value.
       println("Hello, enter your name:")
       val name = readln()
       // Count the letters in the name.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // Print the number of unique letters.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 애플리케이션을 실행합니다.
4. 이름을 입력하고 결과를 확인합니다.

   <img src="/img/native-output-gutter-3.png" alt="애플리케이션 출력" width="422" style={{verticalAlign: 'middle'}}/>

## Gradle 사용

이 섹션에서는 [Gradle](https://gradle.org)을 사용하여 Kotlin/Native 애플리케이션을 수동으로 만드는 방법을 배웁니다.
Kotlin/Native 및 Kotlin Multiplatform 프로젝트의 기본 빌드 시스템이며 Java, Android 및 기타 생태계에서도 일반적으로 사용됩니다.

### 프로젝트 파일 생성

1. 시작하려면 호환되는 버전의 [Gradle](https://gradle.org/install/)을 설치합니다. [호환성 표](gradle-configure-project#apply-the-plugin)에서 사용 가능한 Gradle 버전과의 Kotlin Gradle 플러그인(KGP) 호환성을 확인하세요.
2. 빈 프로젝트 디렉터리를 만듭니다. 그 안에 다음 내용으로 `build.gradle(.kts)` 파일을 만듭니다.

   <Tabs groupId="build-script">
   <TabItem value="kotlin" label="Kotlin" default>

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "2.1.20"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // on macOS
       // linuxArm64("native") // on Linux
       // mingwX64("native")   // on Windows
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "8.10"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </TabItem>
   <TabItem value="groovy" label="Groovy" default>

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // on macOS
       // linuxArm64('native') // on Linux
       // mingwX64('native')   // on Windows
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '8.10'
       distributionType = 'BIN'
   }
   ```

   </TabItem>
   </Tabs>

   `macosArm64`, `iosArm64` `linuxArm64` 및 `mingwX64`와 같은 다양한 [대상 이름](native-target-support)을 사용하여 코드를 컴파일할 대상을 정의할 수 있습니다.
   이러한 대상 이름은 필요에 따라 플랫폼 이름을 매개변수로 사용할 수 있으며, 이 경우 `native`입니다.
   플랫폼 이름은 프로젝트에서 소스 경로와 작업 이름을 생성하는 데 사용됩니다.

3. 프로젝트 디렉터리에 빈 `settings.gradle(.kts)` 파일을 만듭니다.
4. `src/nativeMain/kotlin` 디렉터리를 만들고 그 안에 다음 내용으로 `hello.kt` 파일을 넣습니다.

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

일반적으로 모든 소스는 `src/<대상 이름>[Main|Test]/kotlin` 디렉터리에 있으며, 여기서 `Main`은 소스 코드용이고 `Test`는 테스트용입니다. `<대상 이름>`은 빌드 파일에 지정된 대로 대상 플랫폼(`native`)에 해당합니다.

### 프로젝트 빌드 및 실행

1. 루트 프로젝트 디렉터리에서 빌드 명령을 실행합니다.

   ```bash
   ./gradlew nativeBinaries
   ```

   이 명령은 `build/bin/native` 디렉터리를 만들고 그 안에 `debugExecutable` 및 `releaseExecutable`의 두 디렉터리를 만듭니다. 여기에는 해당 바이너리 파일이 포함되어 있습니다.

   기본적으로 바이너리 파일의 이름은 프로젝트 디렉터리와 같습니다.

2. 프로젝트를 실행하려면 다음 명령을 실행합니다.

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

터미널에 "Hello, Kotlin/Native!"가 출력됩니다.

### IDE에서 프로젝트 열기

이제 Gradle을 지원하는 모든 IDE에서 프로젝트를 열 수 있습니다. IntelliJ IDEA를 사용하는 경우:

1. **File** | **Open**을 선택합니다.
2. 프로젝트 디렉터리를 선택하고 **Open**을 클릭합니다.
   IntelliJ IDEA는 Kotlin/Native 프로젝트인지 자동으로 감지합니다.

프로젝트에 문제가 발생하면 IntelliJ IDEA가 **Build** 탭에 오류 메시지를 표시합니다.

## 명령줄 컴파일러 사용

이 섹션에서는 명령줄 도구에서 Kotlin 컴파일러를 사용하여 Kotlin/Native 애플리케이션을 만드는 방법을 배웁니다.

### 컴파일러 다운로드 및 설치

컴파일러를 설치하려면:

1. Kotlin의 [GitHub 릴리스](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 페이지로 이동합니다.
2. 이름에 `kotlin-native`가 포함된 파일을 찾아 운영 체제에 적합한 파일을 다운로드합니다(예: `kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`).
3. 아카이브를 원하는 디렉터리에 압축을 풉니다.
4. 셸 프로필을 열고 컴파일러의 `/bin` 디렉터리 경로를 `PATH` 환경 변수에 추가합니다.

   ```bash
   export PATH="/<컴파일러 경로>/kotlin-native/bin:$PATH"
   ```

컴파일러 출력에는 종속성이나 가상 머신 요구 사항이 없지만 컴파일러 자체에는 Java 1.8 이상 런타임이 필요합니다.
[JDK 8(JAVA SE 8) 이상 버전](https://www.oracle.com/java/technologies/downloads/)에서 지원됩니다.

:::

### 프로그램 만들기

작업 디렉터리를 선택하고 `hello.kt`라는 파일을 만듭니다. 다음 코드로 업데이트합니다.

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 콘솔에서 코드 컴파일

애플리케이션을 컴파일하려면 다운로드한 컴파일러를 사용하여 다음 명령을 실행합니다.

```bash
kotlinc-native hello.kt -o hello
```

`-o` 옵션 값은 출력 파일의 이름을 지정하므로 이 호출은 macOS 및 Linux에서 `hello.kexe` 바이너리 파일(Windows에서는 `hello.exe`)을 생성합니다.

사용 가능한 전체 옵션 목록은 [Kotlin 컴파일러 옵션](compiler-reference)을 참조하세요.

### 프로그램 실행

프로그램을 실행하려면 명령줄 도구에서 바이너리 파일이 포함된 디렉터리로 이동하여 다음 명령을 실행합니다.

<Tabs>
<TabItem value="macOS and Linux" label="macOS 및 Linux">

```none
./hello.kexe
```

</TabItem>
<TabItem value="Windows" label="Windows">

```none
./hello.exe
```

</TabItem>
</Tabs>

애플리케이션은 "Hello, Kotlin/Native"를 표준 출력에 출력합니다.

## 다음 단계

* 네이티브 HTTP 클라이언트를 만들고 C 라이브러리와 상호 작용하는 방법을 설명하는 [C Interop 및 libcurl을 사용하여 앱 만들기](native-app-with-c-and-libcurl) 튜토리얼을 완료합니다.
* [실제 Kotlin/Native 프로젝트에 대한 Gradle 빌드 스크립트 작성](multiplatform-dsl-reference) 방법을 알아봅니다.
* [설명서](gradle)에서 Gradle 빌드 시스템에 대해 자세히 알아보세요.