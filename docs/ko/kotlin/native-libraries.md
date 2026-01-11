[//]: # (title: Kotlin/Native 라이브러리)

## 라이브러리 컴파일

프로젝트의 빌드 파일 또는 Kotlin/Native 컴파일러를 사용하여 라이브러리용 `*.klib` 아티팩트를 생성할 수 있습니다.

### Gradle 빌드 파일 사용

Gradle 빌드 파일에 [Kotlin/Native 타겟](native-target-support.md)을 지정하여 `*.klib` 라이브러리 아티팩트를 컴파일할 수 있습니다:

1.  `build.gradle(.kts)` 파일에서 하나 이상의 Kotlin/Native 타겟을 선언하세요. 예를 들어:

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
 
    kotlin {
        macosArm64()    // on macOS
        // linuxArm64() // on Linux
        // mingwX64()   // on Windows
    }
    ```

2.  `<target>Klib` 태스크를 실행하세요. 예를 들어:

    ```bash
    ./gradlew macosArm64Klib
    ```

Gradle은 해당 타겟의 소스 파일을 자동으로 컴파일하고 프로젝트의 `build/libs` 디렉토리에 `.klib` 아티팩트를 생성합니다.

### Kotlin/Native 컴파일러 사용

Kotlin/Native 컴파일러로 라이브러리를 생성하려면:

1.  [Kotlin/Native 컴파일러를 다운로드하고 설치하세요.](native-get-started.md#download-and-install-the-compiler)
2.  Kotlin/Native 소스 파일을 라이브러리로 컴파일하려면 `-produce library` 또는 `-p library` 옵션을 사용하세요:

    ```bash
    kotlinc-native foo.kt -p library -o bar
    ```

    이 명령어는 `foo.kt` 파일의 내용을 `bar`라는 이름의 라이브러리로 컴파일하여 `bar.klib` 아티팩트를 생성합니다.

3.  다른 파일을 라이브러리에 링크하려면 `-library <name>` 또는 `-l <name>` 옵션을 사용하세요. 예를 들어:

    ```bash
    kotlinc-native qux.kt -l bar
    ```
   
    이 명령어는 `qux.kt` 소스 파일과 `bar.klib` 라이브러리의 내용을 컴파일하여 `program.kexe` 최종 실행 바이너리를 생성합니다.

## klib 유틸리티

**klib** 라이브러리 관리 유틸리티를 사용하면 다음 구문을 사용하여 라이브러리를 검사할 수 있습니다:

```bash
klib <command> <library path> [<option>]
```

다음 명령을 현재 사용할 수 있습니다:

| 명령                          | 설명                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | 라이브러리에 대한 일반 정보.                                                                                                                                                                                                                                                                                                                         |
| `dump-abi`                    | 라이브러리의 ABI 스냅샷을 덤프합니다. 스냅샷의 각 줄은 하나의 선언에 해당합니다. 선언에 ABI 비호환 변경이 발생하면 스냅샷의 해당 줄에서 확인할 수 있습니다.                                                                                                                                                                      |
| `dump-ir`                     | 라이브러리 선언의 중간 표현(IR)을 출력으로 덤프합니다. 디버깅 목적으로만 사용하세요.                                                                                                                                                                                                                                                    |
| `dump-ir-signatures`          | 모든 비공개 라이브러리 선언과 이 라이브러리가 사용하는 모든 비공개 선언의 IR 시그니처를 덤프합니다(두 개의 별도 목록으로). 이 명령어는 순전히 IR 데이터를 기반으로 합니다.                                                                                                                                                                    |
| `dump-ir-inlinable-functions` | 라이브러리의 인라인 가능 함수의 IR을 출력으로 덤프합니다. 디버깅 목적으로만 사용하세요.                                                                                                                                                                                                                                     |
| `dump-metadata`               | 모든 라이브러리 선언의 메타데이터를 출력으로 덤프합니다. 디버깅 목적으로만 사용하세요.                                                                                                                                                                                                                                         |
| `dump-metadata-signatures`    | 라이브러리 메타데이터를 기반으로 모든 비공개 라이브러리 선언의 IR 시그니처를 덤프합니다. 대부분의 경우 출력은 IR을 기반으로 시그니처를 렌더링하는 `dump-ir-signatures` 명령어와 동일합니다. 하지만 컴파일 중에 IR 변환 컴파일러 플러그인(예: Compose)이 사용되는 경우, 패치된 선언은 다른 시그니처를 가질 수 있습니다. |

위에 언급된 모든 덤프 명령어는 시그니처 덤프 시 klib 유틸리티가 어떤 IR 시그니처 버전을 렌더링할지 지시하는 추가 `-signature-version {N}` 인수를 허용합니다. 이 인수가 제공되지 않으면 라이브러리가 지원하는 최신 버전을 사용합니다. 예를 들어:

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

또한 `dump-metadata` 명령어는 klib 유틸리티가 출력의 모든 선언에 대한 IR 시그니처를 인쇄하도록 지시하는 `-print-signatures {true|false}` 인수를 허용합니다.

## 라이브러리 생성 및 사용

1.  소스 코드를 `kotlinizer.kt`에 넣어 라이브러리를 생성하세요:

    ```kotlin
    package kotlinizer

    val String.kotlinized
        get() = "Kotlin $this"
    ```

2.  라이브러리를 `.klib`로 컴파일하세요:

    ```bash
    kotlinc-native kotlinizer.kt -p library -o kotlinizer
    ```

3.  생성된 라이브러리에 대해 현재 디렉토리를 확인하세요:

    ```bash
    ls kotlinizer.klib
    ```

4.  라이브러리에 대한 일반 정보를 확인하세요:

    ```bash
    klib info kotlinizer.klib
    ```

5.  `use.kt` 파일에 짧은 프로그램을 생성하세요:

    ```kotlin
    import kotlinizer.*

    fun main(args: Array<String>) {
        println("Hello, ${"world".kotlinized}!")
    }
    ```

6.  `use.kt` 소스 파일을 라이브러리에 링크하여 프로그램을 컴파일하세요:

    ```bash
    kotlinc-native use.kt -l kotlinizer -o kohello
    ```

7.  프로그램을 실행하세요:

    ```bash
    ./kohello.kexe
    ```

출력에서 `Hello, Kotlin world!`를 볼 수 있습니다.

## 라이브러리 검색 순서

> 라이브러리 검색 메커니즘이 곧 변경될 예정입니다. 이 섹션의 업데이트를 기대하며, 더 이상 사용되지 않는 플래그에 의존하지 마십시오.
> 
{style="note"}

`-library foo` 옵션이 주어지면, 컴파일러는 다음 순서로 `foo` 라이브러리를 검색합니다:

1.  현재 컴파일 디렉토리 또는 절대 경로.
2.  기본 레포지토리에 설치된 라이브러리.

    > 기본 레포지토리는 `~/.konan`입니다. `kotlin.data.dir` Gradle 프로퍼티를 설정하여 변경할 수 있습니다.
    > 
    > 또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 디렉토리의 사용자 지정 경로를 구성할 수 있습니다.
    > 
    {style="note"}

3.  `$installation/klib` 디렉토리에 설치된 라이브러리.

## 라이브러리 형식

Kotlin/Native 라이브러리는 미리 정의된 디렉토리 구조를 포함하는 zip 파일이며, 다음 레이아웃을 가집니다:

`foo.klib`를 `foo/`로 압축 해제하면 다음을 얻을 수 있습니다:

```text
- foo/
  - $component_name/
    - ir/
      - 직렬화된 Kotlin IR.
    - targets/
      - $platform/
        - kotlin/
          - LLVM 비트코드로 컴파일된 Kotlin.
        - native/
          - 추가 네이티브 객체의 비트코드 파일.
      - $another_platform/
        - 여러 플랫폼별 Kotlin 및 네이티브 쌍이 있을 수 있습니다.
    - linkdata/
      - 직렬화된 링크 메타데이터를 포함하는 ProtoBuf 파일 세트.
    - resources/
      - 이미지와 같은 일반 리소스. (아직 사용되지 않음).
    - manifest - 라이브러리를 설명하는 Java 속성 형식의 파일.
```

Kotlin/Native 컴파일러 설치의 `klib/common/stdlib` 디렉토리에서 예시 레이아웃을 찾을 수 있습니다.

## klib에서 상대 경로 사용

소스 파일의 직렬화된 IR 표현은 `klib` 라이브러리의 [일부](#library-format)입니다. 이는 올바른 디버그 정보 생성을 위한 파일 경로를 포함합니다. 기본적으로 저장된 경로는 절대 경로입니다.

`-Xklib-relative-path-base` 컴파일러 옵션을 사용하면 형식을 변경하고 아티팩트에서 상대 경로만 사용할 수 있습니다. 이 기능을 사용하려면 소스 파일의 기준 경로(base path)를 하나 이상 인수로 전달하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base는 소스 파일의 기준 경로입니다.
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base는 소스 파일의 기준 경로입니다.
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## 다음 단계

[cinterop 도구를 사용하여 `*.klib` 아티팩트를 생성하는 방법을 알아보세요.](native-definition-file.md)