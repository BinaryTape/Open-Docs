[//]: # (title: LLVMバックエンドのカスタマイズに関するヒント)
<primary-label ref="advanced"/>

Kotlin/Nativeコンパイラは、異なるターゲットプラットフォーム向けのバイナリ実行可能ファイルを最適化および生成するために[LLVM](https://llvm.org/)を使用します。
コンパイル時間のかなりの部分がLLVMに費やされており、大規模なアプリケーションの場合、これは許容できないほど長い時間がかかることがあります。

Kotlin/NativeがLLVMをどのように使用するかをカスタマイズし、最適化パスのリストを調整できます。

## ビルドログの確認

LLVM最適化パスにどれくらいのコンパイル時間が費やされているかを理解するために、ビルドログを見てみましょう。

1.  GradleがLLVMプロファイリングの詳細を出力するように、`-Pkotlin.internal.compiler.arguments.log.level=warning`オプションを付けて`linkRelease*` Gradleタスクを実行します。例：

    ```bash
    ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
    ```

    実行中、タスクは必要なコンパイラ引数を出力します。例：

    ```none
    > Task :linkReleaseExecutableMacosArm64
    Run in-process tool "konanc"
    Entry point method = org.jetbrains.kotlin.cli.utilities.MainKt.daemonMain
    Classpath = [
            /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/kotlin-native-compiler-embeddable.jar
            /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/trove4j.jar
    ]
    Arguments = [
            -Xinclude=...
            -library
            /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib
            -no-endorsed-libs
            -nostdlib
            ...
    ]
    ```

2.  提供された引数に加えて`-Xprofile-phases`引数を付けてコマンドラインコンパイラを実行します。例：

    ```bash
    /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
    -Xinclude=... \
    -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
    ... \
    -Xprofile-phases
    ```

3.  ビルドログに生成された出力を確認します。ログは何万行にも及ぶことがあり、LLVMプロファイリングに関するセクションは最後にあります。

以下は、シンプルなKotlin/Nativeプログラムを実行した際の抜粋です。

```none
Frontend: 275 msec
PsiToIr: 1186 msec
...
... 30k lines
...
LinkBitcodeDependencies: 476 msec
StackProtectorPhase: 0 msec
MandatoryBitcodeLLVMPostprocessingPhase: 2 msec
===-------------------------------------------------------------------------===
                          Pass execution timing report
===-------------------------------------------------------------------------===
  Total Execution Time: 6.7726 seconds (6.7192 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  --- Name ---
   0.9778 ( 22.4%)   0.5043 ( 21.0%)   1.4821 ( 21.9%)   1.4628 ( 21.8%)  InstCombinePass
   0.3827 (  8.8%)   0.2497 ( 10.4%)   0.6323 (  9.3%)   0.6283 (  9.4%)  InlinerPass
   0.2815 (  6.4%)   0.1792 (  7.5%)   0.4608 (  6.8%)   0.4555 (  6.8%)  SimplifyCFGPass
...
   0.6444 (100.0%)   0.5474 (100.0%)   1.1917 (100.0%)   1.1870 (100.0%)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

Kotlin/Nativeコンパイラは、LLVM最適化の2つの個別のシーケンス、すなわちモジュールパスとリンク時パスを実行します。一般的なコンパイルでは、これら2つのパイプラインが連続して実行され、唯一の本当の違いは、実行されるLLVM最適化パスにあります。

上記のログでは、2つのLLVM最適化は`ModuleBitcodeOptimization`と`LTOBitcodeOptimization`です。整形されたテーブルは、各パスのタイミングを含む最適化の出力です。

## LLVM最適化パスのカスタマイズ

上記のパスのいずれかが不当に長いと思われる場合、それをスキップできます。ただし、これにより実行時パフォーマンスが低下する可能性があるため、その後ベンチマークのパフォーマンスの変化を確認する必要があります。

現在、[特定のパスを直接無効にする](https://youtrack.jetbrains.com/issue/KT-69212)方法はありません。ただし、以下のコンパイラオプションを使用して、実行する新しいパスのリストを提供できます。

| **オプション**             | **リリースバイナリのデフォルト値** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

デフォルト値は、実際のパスの長いリストに展開され、そこから不要なパスを除外する必要があります。

実際のパスのリストを取得するには、LLVMディストリビューションと一緒に`~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin`ディレクトリに自動的にダウンロードされる[`opt`](https://llvm.org/docs/CommandGuide/opt.html)ツールを実行します。

例として、リンク時パスのリストを取得するには、次を実行します。

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

これにより、警告と、LLVMのバージョンに依存する長いパスのリストが出力されます。

`opt`ツールからのパスのリストと、Kotlin/Nativeコンパイラが実際に実行するパスの間には、2つの違いがあります。

*   `opt`はデバッグツールであるため、通常は実行されない`verify`パスを1つ以上含みます。
*   Kotlinコンパイラがすでに`devirt`パスを自身で実行しているため、Kotlin/Nativeはそれらのパスを無効にします。

いずれかのパスを無効にした後、実行時パフォーマンスの低下が許容範囲内であるかを確認するために、必ずパフォーマンステストを再実行してください。