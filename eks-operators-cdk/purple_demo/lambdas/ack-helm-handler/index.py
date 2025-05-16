import json, subprocess, os, tempfile, cfnresponse

def handler(event, context):
    print("EVENT", json.dumps(event))
    req = event['RequestType']
    p   = event['ResourceProperties']
    cluster   = p['ClusterName']
    namespace = p['Namespace']
    repo      = p['ChartRepo']
    chart     = p['ChartName']
    version   = p['ChartVersion']
    values    = p['Values']

    # Write values YAML to a tmp-file
    with tempfile.NamedTemporaryFile(delete=False, mode='w') as f:
        f.write(values)
        values_file = f.name

    # Update kubeconfig for this Lambda
    subprocess.check_call([
        'aws','eks','update-kubeconfig',
        '--name',cluster,'--region',os.environ['AWS_REGION']
    ])

    # Ensure namespace exists
    if subprocess.call(['kubectl','get','ns',namespace]):
        subprocess.check_call(['kubectl','create','ns',namespace])

    release = 'ack-sagemaker'

    try:
        if req == 'Delete':
            subprocess.call(['helm','uninstall',release,'-n',namespace])
            subprocess.call(['kubectl','delete','secret',
                             f'sh.helm.release.v1.{release}.*',
                             '-n',namespace,'--ignore-not-found'])
            cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
            return

        # Install / upgrade
        subprocess.check_call([
            'helm','upgrade','--install',release,repo,
            '--version',version,'-n',namespace,
            '--wait','--atomic',
            '-f',values_file
        ])
        cfnresponse.send(event, context, cfnresponse.SUCCESS, {}, physicalResourceId=release)

    except subprocess.CalledProcessError as e:
        cfnresponse.send(event, context, cfnresponse.FAILED,
                         {'Error': str(e)}, physicalResourceId=release)