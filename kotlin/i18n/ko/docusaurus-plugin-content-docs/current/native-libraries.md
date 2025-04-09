---
title: "Kotlin/Native 라이브러리"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Kotlin 컴파일러 관련

Kotlin/Native 컴파일러로 라이브러리를 생성하려면 `-produce library` 또는 `-p library` 플래그를 사용하세요. 예시:

```bash
$ kotlinc-native foo.kt -p library -o bar
```

이 명령은 `foo.kt`의 컴파일된 내용을 담은 `bar.klib`를 생성합니다.

라이브러리를 링크하려면 `-library <name>` 또는 `-l <name>` 플래그를 사용하세요. 예시:

```bash
$ kotlinc-native qux.kt -l bar
```

이 명령은 `qux.kt`와 `bar.klib`를 사용하여 `program.kexe`를 생성합니다.

## cinterop 도구 관련

**cinterop** 도구는 네이티브 라이브러리에 대한 `.klib` 래퍼를 주요 출력물로 생성합니다.
예를 들어, Kotlin/Native 배포판에 제공된 간단한 `libgit2.def` 네이티브 라이브러리 정의 파일을 사용하는 경우

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

`libgit2.klib`를 얻게 됩니다.

자세한 내용은 [C Interop](native-c-interop)을 참조하세요.

## klib 유틸리티

**klib** 라이브러리 관리 유틸리티를 사용하여 라이브러리를 검사하고 설치할 수 있습니다.

다음 명령을 사용할 수 있습니다.

* `content` – 라이브러리 내용 나열:

  ```bash
  $ klib contents <name>
  ```

* `info` – 라이브러리의 부기 정보 검사

  ```bash
  $ klib info <name>
  ```

* `install` – 라이브러리를 기본 위치에 설치

  ```bash
  $ klib install <name>
  ```

* `remove` – 라이브러리를 기본 저장소에서 제거

  ```bash
  $ klib remove <name>
  ```

위의 모든 명령은 기본 저장소와 다른 저장소를 지정하기 위한 추가적인 `-repository <directory>` 인수를 허용합니다.

```bash
$ klib <command> <name> -repository <directory>
```

## 몇 가지 예제

먼저 라이브러리를 만들어 보겠습니다.
다음과 같은 작은 라이브러리 소스 코드를 `kotlinizer.kt`에 넣습니다.

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

라이브러리가 현재 디렉토리에 생성되었습니다.

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

이제 라이브러리의 내용을 확인해 보겠습니다.

```bash
$ klib contents kotlinizer
```

`kotlinizer`를 기본 저장소에 설치할 수 있습니다.

```bash
$ klib install kotlinizer
```

현재 디렉토리에서 해당 흔적을 제거합니다.

```bash
$ rm kotlinizer.klib
```

매우 짧은 프로그램을 만들고 `use.kt`에 넣습니다.

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

이제 방금 만든 라이브러리와 연결하여 프로그램을 컴파일합니다.

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

프로그램을 실행합니다.

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

재미있게 사용하세요!

## 고급 주제

### 라이브러리 검색 순서

`-library foo` 플래그가 주어지면 컴파일러는 다음 순서로 `foo` 라이브러리를 검색합니다.

* 현재 컴파일 디렉토리 또는 절대 경로.
* `-repo` 플래그로 지정된 모든 저장소.
* 기본 저장소에 설치된 라이브러리.

   > 기본 저장소는 `~/.konan`입니다. `kotlin.data.dir` Gradle 속성을 설정하여 변경할 수 있습니다.
   > 
   > 또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 디렉토리에 대한 사용자 정의 경로를 구성할 수 있습니다.
   > 
   

* `$installation/klib` 디렉토리에 설치된 라이브러리.

### 라이브러리 형식

Kotlin/Native 라이브러리는 미리 정의된 디렉토리 구조를 포함하는 zip 파일이며, 다음과 같은 레이아웃을 갖습니다.

`foo.klib`를 `foo/`로 압축 해제하면 다음과 같습니다.

```text
  - foo/
    - $component_name/
      - ir/
        - Serialized Kotlin IR.
      - targets/
        - $platform/
          - kotlin/
            - Kotlin compiled to LLVM bitcode.
          - native/
            - Bitcode files of additional native objects.
        - $another_platform/
          - There can be several platform specific kotlin and native pairs.
      - linkdata/
        - A set of ProtoBuf files with serialized linkage metadata.
      - resources/
        - General resources such as images. (Not used yet).
      - manifest - A file in the java property format describing the library.
```

예제 레이아웃은 설치 디렉토리의 `klib/stdlib` 디렉토리에서 찾을 수 있습니다.

### klib에서 상대 경로 사용

:::note
klib에서 상대 경로 사용은 Kotlin 1.6.20부터 사용할 수 있습니다.

:::

소스 파일의 직렬화된 IR 표현은 `klib` 라이브러리의 [일부입니다](#library-format). 여기에는 적절한 디버그 정보 생성을 위한 파일 경로가 포함됩니다. 기본적으로 저장된 경로는 절대 경로입니다. `-Xklib-relative-path-base` 컴파일러 옵션을 사용하면 형식을 변경하고 아티팩트에서 상대 경로만 사용할 수 있습니다. 이를 작동시키려면 소스 파일의 하나 이상의 기본 경로를 인수로 전달합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base is a base path of source files
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base is a base path of source files
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</TabItem>
</Tabs>