[//]: # (title: Kotlin/Native 라이브러리)

## Kotlin 컴파일러 특징

Kotlin/Native 컴파일러로 라이브러리를 생성하려면 `-produce library` 또는 `-p library` 플래그를 사용하십시오. 예시:

```bash
$ kotlinc-native foo.kt -p library -o bar
```

이 명령은 `foo.kt`의 컴파일된 내용을 포함하는 `bar.klib`를 생성합니다.

라이브러리에 링크하려면 `-library <name>` 또는 `-l <name>` 플래그를 사용하십시오. 예시:

```bash
$ kotlinc-native qux.kt -l bar
```

이 명령은 `qux.kt`와 `bar.klib`로부터 `program.kexe`를 생성합니다.

## cinterop 도구 특징

**cinterop** 도구는 네이티브 라이브러리용 `.klib` 래퍼를 주요 출력으로 생성합니다.
예를 들어, Kotlin/Native 배포판에 제공되는 간단한 `libgit2.def` 네이티브 라이브러리 정의 파일을 사용하면

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

우리는 `libgit2.klib`를 얻을 수 있습니다.

자세한 내용은 [C Interop](native-c-interop.md)에서 참조하십시오.

## klib 유틸리티

**klib** 라이브러리 관리 유틸리티를 사용하면 라이브러리를 검사하고 설치할 수 있습니다.

다음 명령을 사용할 수 있습니다:

* `content` – 라이브러리 내용 나열:

  ```bash
  $ klib contents <name>
  ```

* `info` – 라이브러리의 관리 세부 정보 검사

  ```bash
  $ klib info <name>
  ```

* `install` – 라이브러리를 기본 위치에 설치

  ```bash
  $ klib install <name>
  ```

* `remove` – 기본 리포지토리에서 라이브러리 제거

  ```bash
  $ klib remove <name>
  ```

위의 모든 명령은 기본 리포지토리와 다른 리포지토리를 지정하기 위해 추가적인 `-repository <directory>` 인수를 허용합니다.

```bash
$ klib <command> <name> -repository <directory>
```

## 몇 가지 예시

먼저 라이브러리를 생성해 보겠습니다.
작은 라이브러리 소스 코드를 `kotlinizer.kt`에 넣으십시오:

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

라이브러리가 현재 디렉터리에 생성되었습니다:

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

이제 라이브러리의 내용을 확인해 보겠습니다:

```bash
$ klib contents kotlinizer
```

`kotlinizer`를 기본 리포지토리에 설치할 수 있습니다:

```bash
$ klib install kotlinizer
```

현재 디렉터리에서 흔적을 모두 제거하십시오:

```bash
$ rm kotlinizer.klib
```

아주 짧은 프로그램을 생성하고 `use.kt`에 넣으십시오:

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

이제 방금 생성한 라이브러리와 링크하여 프로그램을 컴파일하십시오:

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

그리고 프로그램을 실행하십시오:

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

즐겁게 사용하십시오!

## 고급 주제

### 라이브러리 검색 순서

`-library foo` 플래그가 주어지면 컴파일러는 다음 순서로 `foo` 라이브러리를 검색합니다:

* 현재 컴파일 디렉터리 또는 절대 경로.
* `-repo` 플래그로 지정된 모든 리포지토리.
* 기본 리포지토리에 설치된 라이브러리.

   > 기본 리포지토리는 `~/.konan`입니다. `kotlin.data.dir` Gradle 속성을 설정하여 변경할 수 있습니다.
   > 
   > 또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 디렉터리에 대한 사용자 지정 경로를 구성할 수 있습니다.
   > 
   {style="note"}

* `$installation/klib` 디렉터리에 설치된 라이브러리.

### 라이브러리 형식

Kotlin/Native 라이브러리는 미리 정의된 디렉터리 구조를 포함하는 ZIP 파일이며, 다음과 같은 레이아웃을 가집니다:

`foo.klib`를 `foo/`로 압축을 풀면 다음과 같습니다:

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
        - 이미지 등 일반 리소스. (아직 사용되지 않음).
      - manifest - 라이브러리를 설명하는 Java 속성 형식 파일.
```

예시 레이아웃은 설치 디렉터리의 `klib/stdlib`에서 찾을 수 있습니다.

### klib에서 상대 경로 사용

> klib에서 상대 경로 사용은 Kotlin 1.6.20부터 사용할 수 있습니다.
> 
{style="note"}

소스 파일의 직렬화된 IR 표현은 `klib` 라이브러리의 [일부](#library-format)입니다. 이는 적절한 디버그 정보 생성을 위한 파일 경로를 포함합니다. 기본적으로 저장된 경로는 절대 경로입니다.
`-Xklib-relative-path-base` 컴파일러 옵션을 사용하면 형식을 변경하고 아티팩트에서 상대 경로만 사용할 수 있습니다. 작동시키려면 하나 또는 여러 개의 소스 파일 기준 경로를 인수로 전달하십시오:

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