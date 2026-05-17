중괄호로 감싸 이름 길이를 문자열에 삽입합니다 – `${it.length}`. `it`은 [람다 파라미터](coding-conventions.md#lambda-parameters)의 기본 이름입니다.

   ```kotlin
   fun main() {
       // 입력값을 읽습니다.
       println("Hello, enter your name:")
       val name = readln()
       // 이름의 글자 수를 셉니다.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 애플리케이션을 실행합니다.
5. 이름을 입력하고 결과를 확인하세요.

   ![애플리케이션 출력](native-output-gutter-2.png){width=500}

이제 이름에서 중복되지 않는 고유한 글자 수만 세어 보겠습니다.

1. `Main.kt` 파일에서 `String`에 대한 새로운 [확장 함수(extension function)](extensions.md#extension-functions) `.countDistinctCharacters()`를 선언합니다.

   * [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 함수를 사용하여 이름을 소문자로 변환합니다.
   * [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 함수를 사용하여 입력 문자열을 문자 목록으로 변환합니다.
   * [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 함수를 사용하여 이름에서 중복되지 않는 글자들만 선택합니다.
   * [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 함수를 사용하여 고유한 글자 수를 셉니다.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. `.countDistinctCharacters()` 함수를 사용하여 이름의 고유한 글자 수를 셉니다.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 입력값을 읽습니다.
       println("Hello, enter your name:")
       val name = readln()
       // 이름의 글자 수를 셉니다.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // 고유한 글자 수를 출력합니다.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 애플리케이션을 실행합니다.
4. 이름을 입력하고 결과를 확인하세요.

   ![애플리케이션 출력](native-output-gutter-3.png){width=500}

## Gradle 사용

이 섹션에서는 [Gradle](https://gradle.org)을 사용하여 Kotlin/Native 애플리케이션을 수동으로 만드는 방법을 배웁니다. Gradle은 Kotlin/Native 및 Kotlin Multiplatform 프로젝트의 기본 빌드 시스템이며, Java, Android 및 기타 생태계에서도 흔히 사용됩니다.

Kotlin/Native 프로젝트를 빌드할 때 Kotlin Gradle 플러그인은 다음 아티팩트들을 다운로드합니다.

* `konanc`, `cinterop`, `jsinterop`과 같은 다양한 도구가 포함된 메인 Kotlin/Native 번들. 기본적으로 Kotlin/Native 번들은 단순한 Gradle 의존성으로 [Maven Central](https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/) 저장소에서 다운로드됩니다.
* `llvm`과 같이 `konanc` 자체에 필요한 의존성. 이들은 커스텀 로직을 사용하여 JetBrains CDN에서 다운로드됩니다.

Gradle 빌드 스크립트의 `repositories {}` 블록에서 메인 번들 다운로드 소스를 변경할 수 있습니다.

### 프로젝트 파일 생성

1. 시작하려면 호환되는 버전의 [Gradle](https://gradle.org/install/)을 설치합니다. 제공되는 Gradle 버전과 Kotlin Gradle 플러그인(KGP)의 호환성을 확인하려면 [호환성 표](gradle-configure-project.md#apply-the-plugin)를 참조하세요.
2. 빈 프로젝트 디렉토리를 생성합니다. 그 안에 다음과 같은 내용으로 `build.gradle(.kts)` 파일을 생성합니다.

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       // 메인 번들을 다운로드할 소스를 지정합니다.
       // 기본적으로 Maven Central이 사용됩니다.
       mavenCentral()
   }

   kotlin {
       macosArm64()    // macOS인 경우
       // linuxArm64() // Linux인 경우
       // mingwX64()   // Windows인 경우
   
       targets.withType<KotlinNativeTarget>().configureEach {
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget

   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       // 메인 번들을 다운로드할 소스를 지정합니다.
       // 기본적으로 Maven Central이 사용됩니다.
       mavenCentral()
   }

   kotlin {
       macosArm64()    // macOS인 경우
       // linuxArm64() // Linux인 경우
       // mingwX64()   // Windows인 경우
   
       targets.withType(KotlinNativeTarget).configureEach {
           binaries {
               executable()
           }
       }
   }

   wrapper {
       gradleVersion = '%gradleVersion%'
       distributionType = 'BIN'
   }
   ```

   </tab>
   </tabs>

   `macosArm64`, `iosArm64`, `linuxArm64`, `mingwX64`와 같은 다양한 [타겟 이름](native-target-support.md)을 사용하여 코드를 컴파일할 타겟을 정의할 수 있습니다. 타겟 이름은 프로젝트에서 소스 경로와 태스크 이름을 생성하는 데 사용됩니다.

3. 프로젝트 디렉토리에 빈 `settings.gradle(.kts)` 파일을 생성합니다.
4. `src/nativeMain/kotlin` 디렉토리를 생성하고 그 안에 다음과 같은 내용으로 `hello.kt` 파일을 만듭니다.

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

관례상 모든 소스는 `src/<platform name>[Main|Test]/kotlin` 디렉토리에 위치하며, `Main`은 소스 코드용, `Test`는 테스트용입니다. 이 경우 `<platform name>`은 `native`입니다.

### 프로젝트 빌드 및 실행

1. 루트 프로젝트 디렉토리에서 해당 타겟에 대한 `<yourTargetName>Binaries` 빌드 명령을 실행합니다. 예:

   ```bash
   ./gradlew macosArm64Binaries
   ```

   이 명령은 `build/bin/<yourTargetName>` 디렉토리를 생성하며, 그 안에 `debugExecutable`과 `releaseExecutable`이라는 두 개의 디렉토리가 포함됩니다. 여기에는 각각의 바이너리 파일이 들어 있습니다.

   기본적으로 바이너리 파일의 이름은 프로젝트 디렉토리 이름과 동일합니다.

2. 프로젝트를 실행하려면 해당 타겟에 대한 `build/bin/<yourTargetName>/debugExecutable/<project_name>.kexe` 명령을 실행합니다. 예:

   ```bash
   build/bin/macosArm64/DebugExecutable/hello.kexe
   ```

터미널에 "Hello, Kotlin/Native!"가 출력됩니다.

### IDE에서 프로젝트 열기

이제 Gradle을 지원하는 모든 IDE에서 프로젝트를 열 수 있습니다. IntelliJ IDEA를 사용하는 경우:

1. **File** | **Open**을 선택합니다.
2. 프로젝트 디렉토리를 선택하고 **Open**을 클릭합니다.
   IntelliJ IDEA는 해당 프로젝트가 Kotlin/Native 프로젝트인지 자동으로 감지합니다.

프로젝트에 문제가 발생하면 IntelliJ IDEA의 **Build** 탭에 오류 메시지가 표시됩니다.

## 명령줄 컴파일러 사용

이 섹션에서는 명령줄 도구에서 Kotlin 컴파일러를 사용하여 Kotlin/Native 애플리케이션을 만드는 방법을 배웁니다.

### 컴파일러 다운로드 및 설치

컴파일러를 설치하려면:

1. Kotlin의 [GitHub releases](%kotlinLatestUrl%) 페이지로 이동하여 **Assets** 섹션까지 아래로 스크롤합니다.
2. 이름에 `kotlin-native`가 포함된 파일을 찾아 자신의 운영 체제에 적합한 파일을 다운로드합니다. 예를 들어 `kotlin-native-prebuilt-linux-x86_64-%kotlinVersion%.tar.gz`와 같은 파일입니다.
3. 원하는 디렉토리에 압축을 풉니다.
4. 셸 프로필을 열고 컴파일러의 `/bin` 디렉토리 경로를 `PATH` 환경 변수에 추가합니다.

   ```bash
   export PATH="/<컴파일러 경로>/kotlin-native/bin:$PATH"
   ```

> 컴파일러 출력물은 의존성이나 가상 머신 요구 사항이 없지만, 컴파일러 자체는 Java 1.8 이상의 런타임이 필요합니다. [JDK 8 (JAVA SE 8) 또는 그 이후 버전](https://www.oracle.com/java/technologies/downloads/)에서 지원됩니다.
>
{style="note"}

### 프로그램 생성

작업 디렉토리를 선택하고 `hello.kt`라는 이름의 파일을 만듭니다. 다음 코드로 내용을 업데이트합니다.

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

`-o` 옵션의 값은 출력 파일의 이름을 지정하므로, 이 호출은 macOS 및 Linux에서는 `hello.kexe` 바이너리 파일을, Windows에서는 `hello.exe`를 생성합니다.

사용 가능한 전체 옵션 목록은 [Kotlin 컴파일러 옵션](compiler-reference.md)을 참조하세요.

### 프로그램 실행

프로그램을 실행하려면 명령줄 도구에서 바이너리 파일이 포함된 디렉토리로 이동하여 다음 명령을 실행합니다.

<tabs>
<tab title="macOS 및 Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

애플리케이션이 표준 출력에 "Hello, Kotlin/Native"를 출력합니다.

## 다음 단계는?

* 네이티브 HTTP 클라이언트를 만들고 C 라이브러리와 상호 작용하는 방법을 설명하는 [C interop 및 libcurl을 사용하여 앱 만들기](native-app-with-c-and-libcurl.md) 튜토리얼을 완료하세요.
* [실제 Kotlin/Native 프로젝트를 위한 Gradle 빌드 스크립트 작성 방법](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)을 배워보세요.
* [문서](gradle.md)에서 Gradle 빌드 시스템에 대해 더 자세히 읽어보세요.