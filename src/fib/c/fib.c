#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <unistd.h>

static unsigned long fib(unsigned int n);
static unsigned long now_us(void);

int main(int argc, char* argv[]) {
    pid_t pid = getpid();
    printf("[");
    int count = 0;
    for (int j = 1; j < argc; ++j) {
        unsigned int n = atoi(argv[j]);
        unsigned long t0 = now_us();
        unsigned long f = fib(n);
        unsigned long t1 = now_us();
        unsigned long elapsed = t1 - t0;
        printf("%s\n  { \"pid\": %ld, \"lang\": \"%s\", \"n\": %u, \"fib\": %lu, \"elapsed_us\": %lu }",
               count ? "," : "", (long) pid, "C", n, f, elapsed);
        ++count;
    }
    printf("%s]\n", count > 0 ? "\n" : "");
}

static unsigned long fib(unsigned int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n-1) + fib(n-2);
}

static unsigned long now_us(void)
{
    struct timeval tv;
    unsigned long now = 0.0;
    int rc = gettimeofday(&tv, 0);
    if (rc == 0) {
        now = 1000000 * tv.tv_sec + tv.tv_usec;
    }
    return now;
}
